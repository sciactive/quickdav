import { userInfo, networkInterfaces } from 'node:os';
import path from 'node:path';
import express from 'express';
import {
  app,
  session,
  dialog,
  ipcMain,
  screen,
  shell,
  BrowserWindow,
  Menu,
  Tray,
} from 'electron';
import nepheleServer from 'nephele';
import FileSystemAdapter from '@nephele/adapter-file-system';
import VirtualAdapter from '@nephele/adapter-virtual';
import CustomAuthenticator, { User } from '@nephele/authenticator-custom';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const server = express();
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
      hosts.push({ name, family, address: net.address, port: PORT });
    }
  }
}
if (hosts.find((host) => host.family === 'IPv4')) {
  hosts = hosts.filter((host) => host.family === 'IPv4');
}

server.use(
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

server.listen(PORT, () => {
  console.log(
    `Quick DAV server listening on ${hosts
      .map(({ name, address }) => `${address}:${PORT} (${name})`)
      .join(', ')}`
  );
});

ipcMain.on('focusWindow', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  if (win == null) {
    return;
  }

  win.focus();
  event.sender.focus();
});

ipcMain.on('openDevTools', (event) => {
  if (EXPLICIT_DEV) {
    event.sender.openDevTools();
  }
});

ipcMain.on('getHosts', (event) => {
  event.sender.send('hosts', hosts);
});

const createWindow = async () => {
  const point = screen.getCursorScreenPoint();
  const cursorDisplay = screen.getDisplayNearestPoint(point);
  const {
    x: displayX,
    y: displayY,
    width: displayWidth,
    height: displayHeight,
  } = cursorDisplay.workArea;

  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    maximizable: true,
    resizable: true,
    alwaysOnTop: true,
    title: 'Quick DAV',
    icon: path.join(__dirname, '..', 'assets', 'logo.png'),
    width: EXPLICIT_DEV ? displayWidth / 2 : displayWidth,
    height: EXPLICIT_DEV ? displayHeight / 2 : displayHeight,
    x: displayX + (EXPLICIT_DEV ? displayWidth / 4 : 0),
    y: displayY + (EXPLICIT_DEV ? displayHeight / 4 : 0),
    movable: true,
    skipTaskbar: true,
    backgroundColor: '#000',
  });

  win.loadFile('assets/main.html');

  win.setFullScreen(!EXPLICIT_DEV);
  win.setAlwaysOnTop(!EXPLICIT_DEV, 'normal');
  win.removeMenu();

  win.on('closed', () => {
    app.quit();
    process.exit(0);
  });
};

app.whenReady().then(() => {
  return createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
  process.exit(0);
});
