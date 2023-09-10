import type { Server } from 'node:http';
import https from 'node:https';
import http from 'node:http';
import { userInfo, networkInterfaces } from 'node:os';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { powerSaveBlocker } from 'electron';
import type { Request } from 'express';
import express from 'express';
import selfsigned from 'selfsigned';
import { Address6 } from 'ip-address';
import './crypto-getrandomvalues-polyfill.js';
import type {
  Plugin,
  AuthResponse,
  Method,
  Resource,
  Properties,
  Lock,
} from 'nephele';
import nepheleServer from 'nephele';
import FileSystemAdapter from '@nephele/adapter-file-system';
import VirtualAdapter from '@nephele/adapter-virtual';
import CustomAuthenticator, { User } from '@nephele/authenticator-custom';
import InsecureAuthenticator from '@nephele/authenticator-none';
import IndexPlugin from '@nephele/plugin-index';
import ReadOnlyPlugin from '@nephele/plugin-read-only';

import type { Hosts } from './preload.js';
import {
  HOSTNAME,
  PORT,
  USERNAME,
  PASSWORD,
  SECURE,
  AUTH,
  READONLY,
  WIN,
  LINUX,
  STEAMLAUNCH,
} from './variables.js';

export const setLogFunction = (fn: typeof log) => (log = fn);

let log = (_line: string) => {};

const getHosts = () => {
  const ifaces = networkInterfaces();
  let hosts: Hosts = [];
  for (let name in ifaces) {
    const netDict = ifaces[name];
    if (netDict == null) {
      continue;
    }
    for (let net of netDict) {
      if (!net.internal && net.address) {
        hosts.push({ name, family: net.family, address: net.address });
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
    let myFolders = value.map((folder) => {
      let name = 'Unknown';

      if (folder === home) {
        name = 'Home';
      } else {
        const basename = path.basename(folder);

        if (basename === '') {
          if (WIN) {
            name = folder.replace(/\\/g, '');
          } else {
            name = 'Root';
          }
        } else {
          name = basename;
        }
      }

      return {
        name,
        path: folder,
      };
    });

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
    if (LINUX && STEAMLAUNCH) {
      try {
        await fsp.access('/run/media/mmcblk0p1');
        sdCardPath = '/run/media/mmcblk0p1';
      } catch (e: any) {
        // Ignore errors.
      }
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
  readonly = READONLY,
}: {
  port?: number;
  username?: string;
  password?: string;
  secure?: boolean;
  auth?: boolean;
  readonly?: boolean;
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
      plugins: [
        new LogPlugin(),
        new IndexPlugin({
          name: 'SciActive QuickDAV',
          serveIndexes: false,
          showForms: !readonly,
        }),
        ...(readonly ? [new ReadOnlyPlugin()] : []),
      ],
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

  return {
    server,
    info: { hosts, port, username, password, secure, auth, readonly },
  };
}

class LogPlugin implements Plugin {
  async prepare(request: Request, response: AuthResponse) {
    log(
      `[${response.locals.requestId}]: Client: ${request.ip}, Request: ${request.method} ${request.hostname}${request.url}`
    );
    response.on('close', () => {
      const status = response.statusCode ?? 0;
      log(
        `[${response.locals.requestId}]: Result: ${status} ${
          response.statusMessage
        }${
          status === 207
            ? ''
            : status >= 200 && status < 300
            ? ' (Success)'
            : status >= 300 && status < 400
            ? ' (Redirected)'
            : status >= 400 && status < 500
            ? ' (Client Error)'
            : status >= 500 && status < 600
            ? ' (Server Error)'
            : ''
        }`
      );
    });
    response.on('error', (e: any) => {
      log(`[${response.locals.requestId}]: Error: ${e.message}`);
    });
  }
  async afterGet(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      properties: Properties;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Retrieved resource: ${await data.resource.getCanonicalPath()}`
    );
  }
  async afterHead(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      properties: Properties;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Retrieved resource info: ${await data.resource.getCanonicalPath()}`
    );
  }
  async beforeCopy(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      destination: Resource;
      depth: string;
      overwrite: string | undefined;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Copying resource: ${await data.resource.getCanonicalPath()} -> ${await data.destination.getCanonicalPath()}`
    );
  }
  async afterCopy(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      destination: Resource;
      depth: string;
      overwrite: string | undefined;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Resource copied: ${await data.resource.getCanonicalPath()} -> ${await data.destination.getCanonicalPath()}`
    );
  }
  async beforeDelete(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Deleting resource: ${await data.resource.getCanonicalPath()}`
    );
  }
  async afterDelete(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Resource deleted: ${await data.resource.getCanonicalPath()}`
    );
  }
  async afterLock(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      lock: Lock;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Resource locked: ${await data.resource.getCanonicalPath()} (Lock Token: ${
        data.lock.token
      })`
    );
  }
  async afterMkcol(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Directory created: ${await data.resource.getCanonicalPath()}`
    );
  }
  async beforeMove(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      destination: Resource;
      overwrite: string | undefined;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Moving resource: ${await data.resource.getCanonicalPath()} -> ${await data.destination.getCanonicalPath()}`
    );
  }
  async afterMove(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      destination: Resource;
      overwrite: string | undefined;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Resource moved: ${await data.resource.getCanonicalPath()} -> ${await data.destination.getCanonicalPath()}`
    );
  }
  async afterOptions(_request: Request, response: AuthResponse) {
    log(`[${response.locals.requestId}]: Discovery completed`);
  }
  async afterPropfind(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      depth: string;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Resource listing completed: ${await data.resource.getCanonicalPath()} (Depth: ${
        data.depth
      })`
    );
  }
  async afterProppatch(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      depth: string;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Resource metadata updated: ${await data.resource.getCanonicalPath()} (Depth: ${
        data.depth
      }`
    );
  }
  async afterPut(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      newResource: boolean;
    }
  ) {
    log(
      `[${response.locals.requestId}]: Resource ${
        data.newResource ? 'created' : 'updated'
      }: ${await data.resource.getCanonicalPath()}`
    );
  }
  async beforeUnlock(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      token: string;
      lock: Lock | undefined;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Unlocking resource: ${await data.resource.getCanonicalPath()} (Lock Token: ${
        data.token
      })`
    );
  }
  async afterUnlock(
    _request: Request,
    response: AuthResponse,
    data: {
      method: Method;
      resource: Resource;
      token: string;
      lock: Lock | undefined;
    }
  ) {
    log(
      `[${
        response.locals.requestId
      }]: Resource unlocked: ${await data.resource.getCanonicalPath()}`
    );
  }
  async afterMethod(_request: Request, response: AuthResponse) {
    log(`[${response.locals.requestId}]: Method completed`);
  }
}
