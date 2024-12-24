import type { ElectronAPI } from '../server/preload.js';
import { mount } from 'svelte';
import App from './App.svelte';
import pkg from '../app/package.json';

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

  document.addEventListener('click', (event) => {
    let anchor: HTMLAnchorElement | null = null;
    let target = event.target;

    while (target) {
      if (
        'tagName' in target &&
        target.tagName === 'A' &&
        'href' in target &&
        typeof target.href === 'string' &&
        'target' in target &&
        target.target === '_blank'
      ) {
        anchor = target as HTMLAnchorElement;
        break;
      } else {
        target = (target as HTMLElement).parentElement;
      }
    }

    if (anchor) {
      event.preventDefault();
      electronAPI.openLink(anchor.href);
    }
  });

  mount(App, {
    target: document.body,
    props: {
      electronAPI,
      pkg,
    },
  });
});
