import path from 'node:path';
import fs from 'node:fs';
import { userInfo } from 'node:os';
import { spawn } from 'node:child_process';
import type { MenuItemConstructorOptions } from 'electron';
import {
  app,
  dialog,
  ipcMain,
  screen,
  nativeTheme,
  shell,
  BrowserWindow,
  Menu,
} from 'electron';
import { autoUpdater } from 'electron-updater';

import {
  EXPLICIT_DEV,
  DARK_MODE,
  DARK_MODE_EXPLICIT,
  STEAMLAUNCH,
  GAMEPADUI,
  WIDTH,
  HEIGHT,
  MAC,
  LOGGING,
  AUTOUPDATE,
} from './variables.js';

// Needed until https://github.com/electron/electron/issues/46538 is fixed.
app.commandLine.appendSwitch('gtk-version', '3');

if (process.env.APPIMAGE) {
  // Handle the artifact name change from v1 to v2.
  if (path.basename(process.env.APPIMAGE) === 'QuickDAV-1.0.0.AppImage') {
    console.log('Renaming AppImage to new name scheme.');
    const oldPath = process.env.APPIMAGE;
    const newPath = path.join(
      path.dirname(process.env.APPIMAGE),
      'QuickDAV.AppImage',
    );
    fs.renameSync(oldPath, newPath);
    fs.symlinkSync(newPath, oldPath);
  }
}

// app.commandLine.appendSwitch('--no-sandbox');
// app.commandLine.appendSwitch('no-sandbox');
// app.commandLine.appendSwitch('--disable-dev-shm-usage');
// app.commandLine.appendSwitch('disable-dev-shm-usage');
// app.commandLine.appendSwitch('--disable-seccomp-filter-sandbox');
// app.commandLine.appendSwitch('disable-seccomp-filter-sandbox');

import { setFolders, davServer, setLogFunction } from './davServer.js';

if (DARK_MODE_EXPLICIT && DARK_MODE) {
  nativeTheme.themeSource = 'dark';
} else if (DARK_MODE_EXPLICIT && !DARK_MODE) {
  nativeTheme.themeSource = 'light';
}

if (STEAMLAUNCH) {
  // app.commandLine.appendSwitch('--in-process-gpu');
  // app.commandLine.appendSwitch('in-process-gpu');
  // app.commandLine.appendSwitch('--disable-direct-composition');
  // app.commandLine.appendSwitch('disable-direct-composition');
  app.commandLine.appendSwitch('--disable-gpu-sandbox');
  app.commandLine.appendSwitch('disable-gpu-sandbox');
}

try {
  app.setAboutPanelOptions({
    applicationName: 'QuickDAV',
    copyright: 'Copyright © 2022 SciActive Inc',
    website: 'https://sciactive.com/quickdav/',
    iconPath: path.join(__dirname, '..', 'logo.png'),
  });

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      ...(MAC ? [{ role: 'appMenu' } as MenuItemConstructorOptions] : []),
      {
        label: 'File',
        submenu: [MAC ? { role: 'close' } : { role: 'quit' }],
      },
      { role: 'editMenu' },
      {
        label: 'View',
        submenu: [
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
        ],
      },
      { role: 'windowMenu' },
      {
        role: 'help',
        submenu: [
          {
            label: 'Get Support',
            click: async () => {
              await shell.openExternal('mailto:support@sciactive.com');
            },
          },
          {
            label: 'Learn More',
            click: async () => {
              await shell.openExternal('https://sciactive.com/quickdav/');
            },
          },
        ],
      },
    ]),
  );

  app.whenReady().then(async () => {
    // Auto-update
    if (AUTOUPDATE) {
      autoUpdater.checkForUpdatesAndNotify();
    }

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

    ipcMain.on('openLink', (_event, url: string) => {
      shell.openExternal(url);
    });

    ipcMain.on('openKeyboard', () => {
      if (process.env.SteamClientLaunch == '1') {
        spawn('steam', ['steam://open/keyboard']);
      }
    });

    ipcMain.on('openDevTools', (event) => {
      if (EXPLICIT_DEV) {
        event.sender.openDevTools({ mode: 'detach', activate: true });
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
        folders.map((folder) => folder.path),
      );
    });

    ipcMain.on('openFoldersDialog', async (event, title?: string) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);

      if (win == null) {
        return;
      }

      const result = await dialog.showOpenDialog(win, {
        title,
        defaultPath: userInfo().homedir,
        properties: ['openDirectory', 'multiSelections'],
      });

      if (result.canceled) {
        return;
      }

      event.sender.send('openedFolders', result.filePaths);
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

    let logging = LOGGING;

    ipcMain.on('stopLogging', async (event) => {
      logging = false;
      setLogFunction((_line: string) => {});
      event.sender.send('log', 'Logging disabled.');
      event.sender.send('logging', logging);
    });

    ipcMain.on('startLogging', async (event) => {
      logging = true;
      setLogFunction((line: string) => {
        event.sender.send('log', line);
      });
      event.sender.send('log', 'Logging enabled.');
      event.sender.send('logging', logging);
    });

    ipcMain.on('getLogging', (event) => {
      event.sender.send('logging', logging);
    });

    ipcMain.on('setFolders', async (event, requestFolders) => {
      try {
        folders = await setFolders(requestFolders);
        event.sender.send(
          'folders',
          folders.map((folder) => folder.path),
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
          zoomFactor: GAMEPADUI ? (1.8 / 800) * displayHeight : 1,
          devTools: EXPLICIT_DEV,
        },
        maximizable: true,
        resizable: true,
        fullscreenable: true,
        fullscreen: GAMEPADUI,
        title: 'QuickDAV',
        icon: path.join(__dirname, '..', 'assets', 'icons', 'png', '64x64.png'),
        width: GAMEPADUI ? displayWidth : WIDTH,
        height: GAMEPADUI ? displayHeight : HEIGHT,
        x: displayX + (GAMEPADUI ? 0 : (displayWidth - WIDTH) / 2),
        y: displayY + (GAMEPADUI ? 0 : (displayHeight - HEIGHT) / 2),
        movable: true,
        backgroundColor: DARK_MODE ? '#000' : '#fff',
      });

      win.loadFile('assets/main.html');
      win.removeMenu();

      win.on('ready-to-show', () => {
        // Required for changes of zoomFactor. See https://stackoverflow.com/a/44196987
        win.webContents.setZoomFactor(
          GAMEPADUI ? (1.8 / 800) * displayHeight : 1,
        );
      });

      // win.webContents.openDevTools({
      //   mode: 'detach',
      //   activate: true,
      // });

      win.on('close', () => {
        setLogFunction((_line: string) => {});
      });

      win.on('closed', quit);
    };

    app.on('window-all-closed', quit);

    function quit() {
      setLogFunction((_line: string) => {});
      server.once('close', () => {
        app.quit();
      });
      server.close();
      server.closeIdleConnections();
      // After 1 second of waiting, close all existing connections.
      setTimeout(() => {
        server.closeAllConnections();
      }, 1000);
    }

    return createWindow();
  });
} catch (e: any) {
  dialog.showErrorBox('Error', e.message);
}
