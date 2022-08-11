import { contextBridge, ipcRenderer } from 'electron';

export type ElectronAPI = {
  focusWindow: () => void;
  openDevTools: () => void;
};

contextBridge.exposeInMainWorld('electronAPI', {
  focusWindow: () => ipcRenderer.send('focusWindow'),
  openDevTools: () => ipcRenderer.send('openDevTools'),
} as ElectronAPI);
