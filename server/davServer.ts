import type { Server } from 'node:http';
import https from 'node:https';
import http from 'node:http';
import { userInfo, networkInterfaces, hostname } from 'node:os';
import fsp from 'node:fs/promises';
import express from 'express';
import selfsigned from 'selfsigned';
import { Address6 } from 'ip-address';
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';
import nepheleServer from 'nephele';
import FileSystemAdapter from '@nephele/adapter-file-system';
import VirtualAdapter from '@nephele/adapter-virtual';
import CustomAuthenticator, { User } from '@nephele/authenticator-custom';

import type { Hosts } from './preload.js';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';
const HOSTNAME = hostname();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8443;

const passGen = customAlphabet(
  nolookalikesSafe
    .split('')
    .filter((letter) => letter.toLowerCase() === letter)
    .join(''),
  5
);

export async function davServer({
  port = PORT,
  username = 'quickdav',
  password = passGen(),
  secure = true,
}: {
  port?: number;
  username?: string;
  password?: string;
  secure?: boolean;
} = {}) {
  const app = express();
  const instanceDate = new Date();

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

  if (hosts.length === 0) {
    throw new Error('No configured network adapters could be found.');
  }

  let sdCardPath: string | null = null;
  try {
    await fsp.access('/run/media/mmcblk0p1');
    sdCardPath = '/run/media/mmcblk0p1';
  } catch (e: any) {
    // Ignore errors.
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
          const home = userInfo().homedir;
          if (sdCardPath == null) {
            return new FileSystemAdapter({
              root: home,
              usernamesMapToSystemUsers: false,
            });
          } else {
            return {
              '/': new VirtualAdapter({
                files: {
                  properties: {
                    creationdate: instanceDate,
                    getlastmodified: instanceDate,
                    owner: 'root',
                  },
                  locks: {},
                  children: [
                    {
                      name: 'Home',
                      properties: {
                        creationdate: instanceDate,
                        getlastmodified: instanceDate,
                        owner: 'root',
                      },
                      locks: {},
                      children: [],
                    },
                    {
                      name: 'SDCard',
                      properties: {
                        creationdate: instanceDate,
                        getlastmodified: instanceDate,
                        owner: 'root',
                      },
                      locks: {},
                      children: [],
                    },
                  ],
                },
              }),
              '/Home/': new FileSystemAdapter({
                root: home,
                usernamesMapToSystemUsers: false,
              }),
              '/SDCard/': new FileSystemAdapter({
                root: sdCardPath,
                usernamesMapToSystemUsers: false,
              }),
            };
          }
        } catch (e) {
          throw new Error("Couldn't mount user directory as server root.");
        }
      },
      authenticator: new CustomAuthenticator({
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
        realm: 'Quick DAV Server',
      }),
    })
  );

  let server: Server;
  if (secure) {
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
          value: 'Quick DAV',
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

    server = https
      .createServer({ cert: pems.cert, key: pems.private }, app)
      .listen(port);
  } else {
    server = http.createServer({}, app).listen(port);
  }

  console.log(
    `Quick DAV server listening on ${hosts
      .map(
        ({ name, address }) =>
          `dav${secure ? 's' : ''}://${address}:${port} (${name})`
      )
      .join(', ')}`
  );

  server.on('close', () => {
    console.log('Quick DAV server closed.');
  });

  return { server, info: { hosts, port, username, password, secure } };
}
