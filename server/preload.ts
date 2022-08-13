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
};

export type ElectronAPI = {
  focusWindow: () => void;
  getInfo: () => void;
  onInfo: (callback: (info: Info) => void) => void;
  stopServer: () => void;
  startServer: (info: Info) => void;
  openDevTools: () => void;
};

contextBridge.exposeInMainWorld('electronAPI', {
  focusWindow: () => ipcRenderer.send('focusWindow'),
  getInfo: () => ipcRenderer.send('getInfo'),
  onInfo: (callback) =>
    ipcRenderer.on('info', (_event, info) => callback(info)),
  stopServer: () => ipcRenderer.send('stopServer'),
  startServer: (info) => ipcRenderer.send('startServer', info),
  openDevTools: () => ipcRenderer.send('openDevTools'),
} as ElectronAPI);
