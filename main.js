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

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';

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
  const point = screen.getCursorScreenPoint();
  console.log(point);
  const cursorDisplay = screen.getDisplayNearestPoint(point);
  console.log(cursorDisplay);
  const {
    x: displayX,
    y: displayY,
    width: displayWidth,
    height: displayHeight,
  } = cursorDisplay.workArea;

  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'assets', 'preload.js'),
    },
    maximizable: true,
    resizable: true,
    alwaysOnTop: true,
    title: 'Quick DAV',
    icon: path.join(__dirname, 'assets', 'logo.png'),
    width: EXPLICIT_DEV ? displayWidth / 2 : displayWidth,
    height: EXPLICIT_DEV ? displayHeight / 2 : displayHeight,
    x: displayX + (EXPLICIT_DEV ? displayWidth / 4 : 0),
    y: displayY + (EXPLICIT_DEV ? displayHeight / 4 : 0),
    movable: true,
    skipTaskbar: true,
    backgroundColor: '#000',
  });

  win.loadFile('assets/mainscreen.html');

  win.setFullScreen(!EXPLICIT_DEV);
  win.setAlwaysOnTop(!EXPLICIT_DEV, 'normal');
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
