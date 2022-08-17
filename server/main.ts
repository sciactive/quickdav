import path from 'node:path';
import { spawn } from 'node:child_process';
import { app, dialog, ipcMain, screen, shell, BrowserWindow } from 'electron';
// import steamworks from 'steamworks.js';
// import dlopen from 'ldll';
// import ffi from 'ffi-napi';
// import ref from 'ref-napi';
// import refStructLoad from 'ref-struct-di';

// const refStruct = refStructLoad(ref);

app.commandLine.appendSwitch('--in-process-gpu');
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('--disable-direct-composition');
app.commandLine.appendSwitch('disable-direct-composition');
app.commandLine.appendSwitch('--disable-gpu-sandbox');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('no-sandbox');
// app.commandLine.appendSwitch('--no-sandbox');
// app.commandLine.appendSwitch('disable-gpu');
// app.commandLine.appendSwitch('disable-software-rasterizer');
// app.commandLine.appendSwitch('disable-gpu-compositing');
// app.commandLine.appendSwitch('disable-gpu-rasterization');
// app.disableHardwareAcceleration();

// The constructor of steamworks's default export calls the Steam API Init function.
// const client = steamworks.init(
//   parseInt(process.env.SteamAppId || '0') ||
//     parseInt(process.env.SteamGameId || '0')
// );

// dialog.showMessageBox({ message: client.localplayer.getName() });

// typedefs
/*
enum EFloatingGamepadTextInputMode
{
	k_EFloatingGamepadTextInputModeModeSingleLine = 0,		// Enter dismisses the keyboard
	k_EFloatingGamepadTextInputModeModeMultipleLines = 1,	// User needs to explictly close the keyboard
	k_EFloatingGamepadTextInputModeModeEmail = 2,			// Keyboard layout is email, enter dismisses the keyboard
	k_EFloatingGamepadTextInputModeModeNumeric = 3,			// Keyboard layout is numeric, enter dismisses the keyboard
};
*/
// const steamutilstype = ffi.types.Object;
// refStruct({
//   ShowFloatingGamepadTextInput: ffi.Function(ffi.types.bool, [
//     ffi.types.int /* eKeyboardMode */,
//     ffi.types.int /* nTextFieldXPosition */,
//     ffi.types.int /* nTextFieldYPosition */,
//     ffi.types.int /* nTextFieldWidth */,
//     ffi.types.int /* nTextFieldHeight */,
//   ]),
// });

// const libsteamReader = dlopen(path.resolve(__dirname + '/../libsteam_api.so'));
// const libsteam = ffi.DynamicLibrary(
//   path.resolve(__dirname + '/../libsteam_api.so')
// {
//   SteamAPI_Init: [ffi.types.bool, [ffi.types.int]],
//   SteamAPI_SteamUtils_v010: [steamutilstype, []],
//   SteamAPI_IsSteamRunning: [ffi.types.bool, []],
//   SteamAPI_ISteamUtils_ShowFloatingGamepadTextInput: [ffi.types.void, []],
//   SteamAPI_Shutdown: [ffi.types.void, []],
// }
// );

// const steaminitPtr = libsteam.get('SteamAPI_Init');
// const steaminit = ffi.ForeignFunction(steaminitPtr, ffi.types.bool, [
//   ffi.types.int,
// ]);

// const steamutilsPtr = libsteam.get('SteamAPI_SteamUtils_v010');
// const steamutils = ffi.ForeignFunction(steamutilsPtr, steamutilstype, []);

// console.log(
//   libsteamReader.get('SteamAPI_ISteamUtils_ShowFloatingGamepadTextInput')
// );
// console.log(libsteamReader.get('SteamAPI_Init'));
// console.log(libsteamReader.get('SteamAPI_IsSteamRunning'));
// const Utils = libsteamReader.get('SteamAPI_SteamUtils_v010');

// const SteamInit = steaminit(parseInt(process.env.SteamAppId || '480'));
// const SteamRunning = libsteam.SteamAPI_IsSteamRunning();

// const SteamUtils = libsteam.SteamAPI_SteamUtils_v010();

// console.log(Utils);
// console.log(SteamInit, SteamRunning, SteamUtils);

// libsteam.SteamAPI_ISteamUtils_ShowFloatingGamepadTextInput();
// const utils = steamutils();
// console.log((utils as any).readObject());
// steamutils().ShowFloatingGamepadTextInput(0, 0, 0, 300, 40);

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

    ipcMain.on('openKeyboard', () => {
      spawn('steam', ['steam://open/keyboard']);
      // spawn('openkeyboard');
      // shell.openExternal('steam://open/keyboard');
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
        // libsteam.SteamAPI_Shutdown();
        app.quit();
      });
      server.close();
    }

    return createWindow();
  });
} catch (e: any) {
  dialog.showErrorBox('Error', e.message);
}
