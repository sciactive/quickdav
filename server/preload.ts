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
};

export type ElectronAPI = {
  focusWindow: () => void;
  getInfo: () => void;
  onInfo: (callback: (info: Info) => void) => void;
  stopServer: () => void;
  startServer: (info: Info) => void;
  openKeyboard: () => void;
  openDevTools: () => void;
};

contextBridge.exposeInMainWorld('electronAPI', {
  focusWindow: () => ipcRenderer.send('focusWindow'),
  getInfo: () => ipcRenderer.send('getInfo'),
  onInfo: (callback) => {
    const listener = (_event: IpcRendererEvent, info: Info) => callback(info);
    ipcRenderer.on('info', listener);
    return () => {
      ipcRenderer.off('info', listener);
    };
  },
  stopServer: () => ipcRenderer.send('stopServer'),
  startServer: (info) => ipcRenderer.send('startServer', info),
  openKeyboard: () => ipcRenderer.send('openKeyboard'),
  openDevTools: () => ipcRenderer.send('openDevTools'),
} as ElectronAPI);
