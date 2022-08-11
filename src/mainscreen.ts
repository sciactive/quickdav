import type { ElectronAPI } from './preload.js';

window.addEventListener('DOMContentLoaded', () => {
  const { electronAPI } = window as unknown as Window & {
    electronAPI: ElectronAPI;
  };

  electronAPI.focusWindow();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'F12') {
      electronAPI.openDevTools();
    }
  });
});
