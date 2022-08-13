import path from 'node:path';
import { app, dialog, ipcMain, screen, BrowserWindow } from 'electron';

import { davServer } from './davServer.js';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';

try {
  app.whenReady().then(async () => {
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

    ipcMain.on('openDevTools', (event) => {
      if (EXPLICIT_DEV) {
        event.sender.openDevTools();
      }
    });

    ipcMain.on('getInfo', (event) => {
      event.sender.send('info', info);
    });

    function forceCloseServer() {
      server.close();
      info = {
        ...info,
        hosts: [],
      };
    }

    ipcMain.on('stopServer', (event) => {
      if (info.hosts.length) {
        forceCloseServer();
        event.sender.send('info', info);
      }
    });

    ipcMain.on('startServer', async (event, requestInfo) => {
      if (info.hosts.length) {
        forceCloseServer();
      }
      ({ server, info } = await davServer(requestInfo));
      event.sender.send('info', info);
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
          zoomFactor: 2,
        },
        maximizable: true,
        resizable: true,
        fullscreen: !EXPLICIT_DEV,
        title: 'Quick DAV',
        icon: path.join(__dirname, '..', 'assets', 'logo.png'),
        width: EXPLICIT_DEV ? 1280 : displayWidth,
        height: EXPLICIT_DEV ? 800 : displayHeight,
        x: displayX + (EXPLICIT_DEV ? (displayWidth - 1280) / 2 : 0),
        y: displayY + (EXPLICIT_DEV ? (displayHeight - 800) / 2 : 0),
        movable: true,
        backgroundColor: '#000',
      });

      win.loadFile('assets/main.html');
      win.removeMenu();

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
