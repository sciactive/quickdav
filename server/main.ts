import path from 'node:path';
import { spawn } from 'node:child_process';
import {
  app,
  dialog,
  ipcMain,
  screen,
  nativeTheme,
  BrowserWindow,
} from 'electron';

app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('no-sandbox');

import { setFolders, davServer } from './davServer.js';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';
const DARK_MODE =
  process.env.DARK_MODE === 'true' ||
  process.env.DARK_MODE === 'on' ||
  (process.env.DARK_MODE !== 'false' &&
    process.env.DARK_MODE !== 'off' &&
    nativeTheme.shouldUseDarkColors);
const GAMEPADUI =
  (!!process.env.GAMEPADUI || process.env.SteamClientLaunch == '1') &&
  process.env.GAMEPADUI !== 'false' &&
  process.env.GAMEPADUI !== 'off';

if (process.env.DARK_MODE === 'true' || process.env.DARK_MODE === 'on') {
  nativeTheme.themeSource = 'dark';
} else if (
  process.env.DARK_MODE === 'false' ||
  process.env.DARK_MODE === 'off'
) {
  nativeTheme.themeSource = 'light';
}

try {
  app.whenReady().then(async () => {
    let folders = await setFolders();
    let { server, info } = await davServer();

    ipcMain.on('focusWindow', (event) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);

      if (win == null) {
        return;
      }

      win.focus();
      event.sender.focus();
    });

    ipcMain.on('openKeyboard', () => {
      if (process.env.SteamClientLaunch == '1') {
        spawn('steam', ['steam://open/keyboard']);
      }
    });

    ipcMain.on('openDevTools', (event) => {
      if (EXPLICIT_DEV) {
        event.sender.openDevTools();
      }
    });

    ipcMain.on('getGamepadUI', (event) => {
      event.sender.send('gamepadUI', GAMEPADUI);
    });

    ipcMain.on('getInfo', (event) => {
      event.sender.send('info', info);
    });

    ipcMain.on('getFolders', (event) => {
      event.sender.send(
        'folders',
        folders.map((folder) => folder.path)
      );
    });

    function forceCloseServer() {
      const promise = new Promise((resolve) => server.on('close', resolve));
      server.close();
      info = {
        ...info,
        hosts: [],
      };
      return promise;
    }

    ipcMain.on('stopServer', async (event) => {
      if (info.hosts.length) {
        await forceCloseServer();
        event.sender.send('info', info);
      }
    });

    ipcMain.on('startServer', async (event, requestInfo) => {
      if (info.hosts.length) {
        await forceCloseServer();
      }
      try {
        ({ server, info } = await davServer(requestInfo));
        event.sender.send('info', info);
      } catch (e: any) {
        dialog.showErrorBox('Server Not Started', e.message);
      }
    });

    ipcMain.on('setFolders', async (event, requestFolders) => {
      try {
        folders = await setFolders(requestFolders);
        event.sender.send(
          'folders',
          folders.map((folder) => folder.path)
        );
      } catch (e: any) {
        dialog.showErrorBox('Folders Not Saved', e.message);
      }
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
          zoomFactor: GAMEPADUI ? 2 : 1,
        },
        maximizable: true,
        resizable: true,
        fullscreen: GAMEPADUI,
        title: 'QuickDAV',
        icon: path.join(__dirname, '..', 'assets', 'logo.png'),
        width: GAMEPADUI ? displayWidth : 1280,
        height: GAMEPADUI ? displayHeight : 800,
        x:
          displayX + (GAMEPADUI ? 0 : Math.min((displayWidth - 1280) / 2, 400)),
        y:
          displayY + (GAMEPADUI ? 0 : Math.min((displayHeight - 800) / 2, 400)),
        movable: true,
        backgroundColor: DARK_MODE ? '#000' : '#fff',
      });

      win.loadFile('assets/main.html');
      win.removeMenu();

      win.on('ready-to-show', () => {
        // Required for changes of zoomFactor. See https://stackoverflow.com/a/44196987
        win.webContents.setZoomFactor(GAMEPADUI ? 2 : 1);
      });

      // win.webContents.openDevTools();

      win.on('closed', quit);
    };

    app.on('window-all-closed', quit);

    function quit() {
      server.once('close', () => {
        app.quit();
      });
      server.close();
    }

    return createWindow();
  });
} catch (e: any) {
  dialog.showErrorBox('Error', e.message);
}
