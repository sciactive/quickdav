import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';

export type Hosts = {
  name: string;
  family: string;
  address: string;
}[];

export type Info = {
  hosts: Hosts;
  port: number;
  username: string;
  password: string;
  secure: boolean;
  auth: boolean;
  readonly: boolean;
};

export type ElectronAPI = {
  focusWindow: () => void;
  openLink: (url: string) => void;
  getInfo: () => void;
  onInfo: (callback: (info: Info) => void) => () => void;
  getFolders: () => void;
  onFolders: (callback: (folders: string[]) => void) => () => void;
  getGamepadUI: () => void;
  onGamepadUI: (callback: (gamepadUI: boolean) => void) => () => void;
  stopServer: () => void;
  startServer: (info: Info) => void;
  setFolders: (folders: string[]) => void;
  openFoldersDialog: (title?: string) => void;
  onOpenedFolders: (callback: (folders: string[]) => void) => () => void;
  stopLogging: () => void;
  startLogging: () => void;
  onLog: (callback: (line: string) => void) => () => void;
  getLogging: () => void;
  onLogging: (callback: (value: boolean) => void) => () => void;
  openKeyboard: () => void;
  openDevTools: () => void;
};

contextBridge.exposeInMainWorld('electronAPI', {
  focusWindow: () => ipcRenderer.send('focusWindow'),
  openLink: (url) => ipcRenderer.send('openLink', url),
  getInfo: () => ipcRenderer.send('getInfo'),
  onInfo: (callback) => {
    const listener = (_event: IpcRendererEvent, info: Info) => callback(info);
    ipcRenderer.on('info', listener);
    return () => {
      ipcRenderer.off('info', listener);
    };
  },
  getFolders: () => ipcRenderer.send('getFolders'),
  onFolders: (callback) => {
    const listener = (_event: IpcRendererEvent, folders: string[]) =>
      callback(folders);
    ipcRenderer.on('folders', listener);
    return () => {
      ipcRenderer.off('folders', listener);
    };
  },
  getGamepadUI: () => ipcRenderer.send('getGamepadUI'),
  onGamepadUI: (callback) => {
    const listener = (_event: IpcRendererEvent, gamepadUI: boolean) =>
      callback(gamepadUI);
    ipcRenderer.on('gamepadUI', listener);
    return () => {
      ipcRenderer.off('gamepadUI', listener);
    };
  },
  stopServer: () => ipcRenderer.send('stopServer'),
  startServer: (info) => ipcRenderer.send('startServer', info),
  setFolders: (folders) => ipcRenderer.send('setFolders', folders),
  openFoldersDialog: (title) => ipcRenderer.send('openFoldersDialog', title),
  onOpenedFolders: (callback) => {
    const listener = (_event: IpcRendererEvent, folders: string[]) =>
      callback(folders);
    ipcRenderer.on('openedFolders', listener);
    return () => {
      ipcRenderer.off('openedFolders', listener);
    };
  },
  stopLogging: () => ipcRenderer.send('stopLogging'),
  startLogging: () => ipcRenderer.send('startLogging'),
  onLog: (callback) => {
    const listener = (_event: IpcRendererEvent, line: string) => callback(line);
    ipcRenderer.on('log', listener);
    return () => {
      ipcRenderer.off('log', listener);
    };
  },
  getLogging: () => ipcRenderer.send('getLogging'),
  onLogging: (callback) => {
    const listener = (_event: IpcRendererEvent, value: boolean) =>
      callback(value);
    ipcRenderer.on('logging', listener);
    return () => {
      ipcRenderer.off('logging', listener);
    };
  },
  openKeyboard: () => ipcRenderer.send('openKeyboard'),
  openDevTools: () => ipcRenderer.send('openDevTools'),
} as ElectronAPI);
