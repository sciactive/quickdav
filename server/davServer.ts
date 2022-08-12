import { userInfo, networkInterfaces } from 'node:os';
import express from 'express';
import nepheleServer from 'nephele';
import FileSystemAdapter from '@nephele/adapter-file-system';
import VirtualAdapter from '@nephele/adapter-virtual';
import CustomAuthenticator, { User } from '@nephele/authenticator-custom';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

export function davServer({ port = PORT }: { port?: number } = {}) {
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
      if (!net.internal) {
        hosts.push({ name, family, address: net.address, port });
      }
    }
  }
  if (hosts.find((host) => host.family === 'IPv4')) {
    hosts = hosts.filter((host) => host.family === 'IPv4');
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

  const server = app.listen(port, () => {
    console.log(
      `Quick DAV server listening on ${hosts
        .map(({ name, address }) => `${address}:${port} (${name})`)
        .join(', ')}`
    );
  });

  return { server, hosts };
}
