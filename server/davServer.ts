import type { Server } from 'node:http';
import https from 'node:https';
import http from 'node:http';
import { userInfo, networkInterfaces, hostname } from 'node:os';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { powerSaveBlocker } from 'electron';
import express from 'express';
import selfsigned from 'selfsigned';
import { Address6 } from 'ip-address';
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';
import './crypto-getrandomvalues-polyfill.js';
import nepheleServer from 'nephele';
import FileSystemAdapter from '@nephele/adapter-file-system';
import VirtualAdapter from '@nephele/adapter-virtual';
import CustomAuthenticator, { User } from '@nephele/authenticator-custom';
import InsecureAuthenticator from '@nephele/authenticator-none';

import type { Hosts } from './preload.js';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';

const passGen = customAlphabet(
  nolookalikesSafe
    .split('')
    .filter((letter) => letter.toLowerCase() === letter)
    .join(''),
  5
);

const HOSTNAME = hostname();
const PORT = parseInt(process.env.DAV_PORT || '8888');
const USERNAME = process.env.DAV_USERNAME || 'quickdav';
const PASSWORD = process.env.DAV_PASSWORD || passGen();
const SECURE = !['false', 'off'].includes(
  (process.env.DAV_TLS || '').toLowerCase()
);
const AUTH = !['false', 'off'].includes(
  (process.env.DAV_AUTH || '').toLowerCase()
);

const getHosts = () => {
  const ifaces = networkInterfaces();
  let hosts: Hosts = [];
  for (let name in ifaces) {
    const netDict = ifaces[name];
    if (netDict == null) {
      continue;
    }
    for (let net of netDict) {
      const family =
        typeof net.family === 'string' ? net.family : `IPv${net.family}`;
      if (!net.internal && net.address) {
        hosts.push({ name, family, address: net.address });
      }
    }
  }
  if (hosts.find((host) => host.family === 'IPv4')) {
    hosts = hosts.filter((host) => host.family === 'IPv4');
  }
  return hosts;
};

let hosts = getHosts();

const pems = selfsigned.generate(
  [
    { name: 'commonName', value: HOSTNAME },
    {
      name: 'countryName',
      value: 'US',
    },
    {
      shortName: 'ST',
      value: 'California',
    },
    {
      name: 'localityName',
      value: 'San Marcos',
    },
    {
      name: 'organizationName',
      value: 'SciActive Inc',
    },
    {
      shortName: 'OU',
      value: 'QuickDAV',
    },
  ],
  {
    days: 30,
    algorithm: 'sha256',
    extensions: [
      {
        name: 'basicConstraints',
        cA: true,
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'subjectAltName',
        altNames: hosts
          .map((host) => ({
            type: 7, // IP Address
            value:
              host.family === 'IPv4'
                ? host.address
                    .split('.')
                    .map((byte) => String.fromCharCode(parseInt(byte)))
                    .join('')
                : new Address6(host.address).parsedAddress
                    .map((bytes) => {
                      const value = parseInt(bytes, 16);
                      const first = value >> 8;
                      const second = value & 255;
                      return `${String.fromCharCode(
                        first
                      )}${String.fromCharCode(second)}`;
                    })
                    .join(''),
          }))
          .concat([
            {
              type: 2, // DNS Name
              value: HOSTNAME,
            },
          ]),
      },
    ],
  }
);

let folders: { name: string; path: string }[] = [];

export async function setFolders(value?: string[]) {
  const home = userInfo().homedir;

  if (value != null) {
    let myFolders = value.map((folder) => ({
      name: folder === home ? 'Home' : path.basename(folder),
      path: folder,
    }));

    for (let i = 0; i < myFolders.length; i++) {
      try {
        await fsp.access(myFolders[i].path);
      } catch (e: any) {
        throw Error(`Folder "${myFolders[i].path}" is not accessible.`);
      }

      let currentNumber = 2;
      if (
        myFolders.findIndex((folder) => folder.name === myFolders[i].name) !== i
      ) {
        myFolders[i].name = `${myFolders[i].name} (${currentNumber})`;
      }

      while (
        myFolders.findIndex((folder) => folder.name === myFolders[i].name) !== i
      ) {
        myFolders[i].name = myFolders[i].name.replace(
          / \(\d+\)$/,
          ` (${++currentNumber})`
        );
      }
    }

    folders = myFolders;
  } else {
    let sdCardPath: string | null = null;
    try {
      await fsp.access('/run/media/mmcblk0p1');
      sdCardPath = '/run/media/mmcblk0p1';
    } catch (e: any) {
      // Ignore errors.
    }

    folders = [
      { name: 'Home', path: home },
      ...(sdCardPath ? [{ name: 'mmcblk0p1', path: sdCardPath }] : []),
    ];
  }

  return folders;
}

let serverRunning = false;

export async function davServer({
  port = PORT,
  username = USERNAME,
  password = PASSWORD,
  secure = SECURE,
  auth = AUTH,
}: {
  port?: number;
  username?: string;
  password?: string;
  secure?: boolean;
  auth?: boolean;
} = {}) {
  const app = express();
  const instanceDate = new Date();

  if (serverRunning) {
    throw new Error(
      'The running server must be closed before a new one can be created.'
    );
  }

  hosts = getHosts();
  if (hosts.length === 0) {
    throw new Error('No configured network adapters could be found.');
  }

  app.use(
    '/',
    nepheleServer({
      adapter: async (_request, response) => {
        if (response.locals.user == null) {
          return new VirtualAdapter({
            files: {
              properties: {
                creationdate: instanceDate,
                getlastmodified: instanceDate,
                owner: 'root',
              },
              locks: {},
              children: [],
            },
          });
        }

        try {
          if (folders.length === 1) {
            return new FileSystemAdapter({
              root: folders[0].path,
              usernamesMapToSystemUsers: false,
            });
          }

          return {
            '/': new VirtualAdapter({
              files: {
                properties: {
                  creationdate: instanceDate,
                  getlastmodified: instanceDate,
                  owner: 'root',
                },
                locks: {},
                children: folders.map((folder) => ({
                  name: folder.name,
                  properties: {
                    creationdate: instanceDate,
                    getlastmodified: instanceDate,
                    owner: 'root',
                  },
                  locks: {},
                  children: [],
                })),
              },
            }),
            ...Object.fromEntries(
              folders.map((folder) => [
                `/${folder.name}/`,
                new FileSystemAdapter({
                  root: folder.path,
                  usernamesMapToSystemUsers: false,
                }),
              ])
            ),
          };
        } catch (e) {
          throw new Error("Couldn't mount user directory as server root.");
        }
      },
      authenticator: auth
        ? new CustomAuthenticator({
            getUser: async (name) => {
              if (name === username) {
                return new User({ username });
              }
              return null;
            },
            ...(secure
              ? {
                  authBasic: async (user, pass) => {
                    if (user.username === username && pass === password) {
                      return true;
                    }
                    return false;
                  },
                }
              : {
                  authDigest: async (user) => {
                    if (user.username === username) {
                      return { password };
                    }
                    return null;
                  },
                }),
            realm: 'QuickDAV Server',
          })
        : new InsecureAuthenticator(),
    })
  );

  let server: Server;
  if (secure) {
    server = https.createServer({ cert: pems.cert, key: pems.private }, app);
  } else {
    server = http.createServer({}, app);
  }

  serverRunning = true;
  let preventSuspension: number = 0;
  server.on('listening', () => {
    console.log(
      `QuickDAV server listening on ${hosts
        .map(
          ({ name, address }) =>
            `dav${secure ? 's' : ''}://${address}:${port} (${name})`
        )
        .join(', ')}`
    );
    preventSuspension = powerSaveBlocker.start('prevent-app-suspension');
  });

  server.on('close', () => {
    serverRunning = false;
    console.log('QuickDAV server closed.');
    powerSaveBlocker.stop(preventSuspension);
  });

  server.listen(port);

  return { server, info: { hosts, port, username, password, secure, auth } };
}
