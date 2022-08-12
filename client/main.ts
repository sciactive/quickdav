import type { ElectronAPI } from '../server/preload.js';

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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'F12') {
      electronAPI.openDevTools();
    }
  });

  electronAPI.onHosts((hosts) => {
    const app = document.getElementById('app');

    if (!app) {
      return;
    }

    app.innerText = `dav://${hosts[0].address}:${hosts[0].port}/ on ${hosts[0].name}`;
  });
  electronAPI.getHosts();
});
