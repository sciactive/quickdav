window.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.focusWindow();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'F12') {
      window.electronAPI.openDevTools();
    }
  });
});
