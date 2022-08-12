import type { Server } from 'node:http';
import https from 'node:https';
import { userInfo, networkInterfaces, hostname } from 'node:os';
import express from 'express';
import selfsigned from 'selfsigned';
import { Address6 } from 'ip-address';
import nepheleServer from 'nephele';
import FileSystemAdapter from '@nephele/adapter-file-system';
import VirtualAdapter from '@nephele/adapter-virtual';
import CustomAuthenticator, { User } from '@nephele/authenticator-custom';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';
const HOSTNAME = hostname();
const REDIRECT_PORT = process.env.REDIRECT_PORT
  ? parseInt(process.env.REDIRECT_PORT)
  : 8080;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8443;

export function davServer({
  port = PORT,
  redirectPort = REDIRECT_PORT,
}: { port?: number; redirectPort?: number } = {}) {
  const app = express();
  const instanceDate = new Date();

  const ifaces = networkInterfaces();
  let hosts: { name: string; family: string; address: string; port: number }[] =
    [];
  for (let name in ifaces) {
    const netDict = ifaces[name];
    if (netDict == null) {
      continue;
    }
    for (let net of netDict) {
      const family =
        typeof net.family === 'string' ? net.family : `IPv${net.family}`;
      if (!net.internal && net.address) {
        hosts.push({ name, family, address: net.address, port });
      }
    }
  }
  if (hosts.find((host) => host.family === 'IPv4')) {
    hosts = hosts.filter((host) => host.family === 'IPv4');
  }

  if (hosts.length === 0) {
    throw new Error('No configured network adapters could be found.');
  }

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
          const root = userInfo().homedir;
          return new FileSystemAdapter({
            root,
            usernamesMapToSystemUsers: false,
          });
        } catch (e) {
          throw new Error("Couldn't mount user directory as server root.");
        }
      },
      authenticator: new CustomAuthenticator({
        auth: async (username, password) => {
          if (username === 'quickdav' && password === 'pass') {
            return new User({ username });
          }
          return null;
        },
        realm: 'Quick DAV Server',
      }),
    })
  );

  const server = https
    .createServer({ cert: pems.cert, key: pems.private }, app)
    .listen(port);
  console.log(
    `Quick DAV server listening on ${hosts
      .map(({ name, address }) => `${address}:${port} (${name})`)
      .join(', ')}`
  );

  let redirectServer: Server | undefined = undefined;
  if (redirectPort) {
    const redirectApp = express();

    redirectApp.use((req, res, next) => {
      if (
        EXPLICIT_DEV &&
        (req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1')
      ) {
        // Skip redirection for local requests on development.
        return next();
      }

      // For remote requests, redirect to the secure app.
      return res.redirect(
        `${req.protocol === 'dav' ? 'davs' : 'https'}://${
          req.hostname
        }:${port}${req.url}`
      );
    });

    if (EXPLICIT_DEV) {
      // Allow the app to run on insecure port on development.
      redirectApp.use(app);
    }

    redirectServer = redirectApp.listen(redirectPort);

    console.log(`Redirecting insecure connections on ${redirectPort}.`);
  }

  return { server, redirectServer, hosts };
}
