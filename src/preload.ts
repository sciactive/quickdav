const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  focusWindow: () => ipcRenderer.send('focusWindow'),
  openDevTools: () => ipcRenderer.send('openDevTools'),
});
