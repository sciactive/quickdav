const path = require('path');
const {
  app,
  session,
  dialog,
  ipcMain,
  screen,
  shell,
  BrowserWindow,
  Menu,
  Tray,
} = require('electron');

ipcMain.on('focusWindow', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  win.focus();
  win.webContents.focus();
});

ipcMain.on('openDevTools', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  win.webContents.openDevTools();
});

const createWindow = async () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: displayWidth, height: displayHeight } =
    primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'assets', 'preload.js'),
    },
    maximizable: false,
    resizable: false,
    alwaysOnTop: true,
    title: 'Quick DAV',
    icon: path.join(__dirname, 'assets', 'logo.png'),
    width: displayWidth,
    height: displayHeight,
    x: 0,
    y: 0,
    frame: false,
    movable: true,
    skipTaskbar: true,
    fullscreen: true,
    backgroundColor: '#000',
  });

  win.loadFile('assets/mainscreen.html');

  win.setFullScreen(true);
  win.setAlwaysOnTop(true, 'normal');
  win.removeMenu();

  win.on('closed', () => {
    app.quit();
  });
};

app.whenReady().then(() => {
  return createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
