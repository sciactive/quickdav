import path from 'node:path';
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

import { davServer } from './davServer.js';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';

try {
  let { server, redirectServer, hosts } = davServer();

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

    win.on('closed', quit);
  };

  app.whenReady().then(() => {
    return createWindow();
  });

  app.on('window-all-closed', quit);

  function quit() {
    redirectServer?.close();
    server.once('close', () => {
      app.quit();
    });
    server.close();
  }
} catch (e: any) {
  dialog.showErrorBox('Error', e.message);
}
