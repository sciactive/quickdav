import { contextBridge, ipcRenderer } from 'electron';

export type Hosts = {
  name: string;
  family: string;
  address: string;
  port: number;
}[];

export type ElectronAPI = {
  focusWindow: () => void;
  getHosts: () => void;
  onHosts: (callback: (hosts: Hosts) => void) => void;
  openDevTools: () => void;
};

contextBridge.exposeInMainWorld('electronAPI', {
  focusWindow: () => ipcRenderer.send('focusWindow'),
  getHosts: () => ipcRenderer.send('getHosts'),
  onHosts: (callback) =>
    ipcRenderer.on('hosts', (_event, hosts) => callback(hosts)),
  openDevTools: () => ipcRenderer.send('openDevTools'),
} as ElectronAPI);
