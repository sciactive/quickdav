<div
  bind:this={approot}
  style="display: flex; flex-direction: column; height: 100%;"
>
  <div
    style="display: flex; flex-direction: row; align-items: center; width: 100%;"
  >
    {#if gamepadUI}
      <div style="padding: 0 .75em;">
        <LeftBumper height="30px" />
      </div>
    {/if}
    <TabBar {tabs} let:tab bind:active style="flex-grow: 1;">
      <Tab {tab}>
        <Icon component={Svg} viewBox="0 0 24 24">
          <path fill="currentColor" d={tab.icon} />
        </Icon>
        <Label>{tab.label}</Label>
      </Tab>
    </TabBar>
    {#if gamepadUI}
      <div style="padding: 0 .75em;">
        <RightBumper height="30px" />
      </div>
    {/if}
  </div>

  {#each tabs as tab (tab.label)}
    <div
      style="padding: 1.2rem; flex-grow: 1; overflow: auto; position: {tab ===
      active
        ? 'relative'
        : 'absolute'}; left: {tab === active ? '0' : '-9999px'};"
    >
      <svelte:component this={tab.component} {electronAPI} {info} {gamepadUI} />
    </div>
  {/each}
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import SpatialNavigation from '@smart-powers/js-spatial-navigation';
  import {
    mdiTabletDashboard,
    mdiFolderMultiple,
    mdiCog,
    mdiDesktopClassic,
  } from '@mdi/js';
  import Tab, { Icon, Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import { Svg } from '@smui/common/elements';
  import type { ElectronAPI, Info } from '../server/preload.js';
  import LeftBumper from './controller-icons/Left Bumper.svelte';
  import RightBumper from './controller-icons/Right Bumper.svelte';
  import Dash from './Dash.svelte';
  import Folders from './Folders.svelte';
  import Config from './Config.svelte';
  import Guide from './Guide.svelte';
  import gamepad from './gamepad.js';

  export let electronAPI: ElectronAPI;

  let info: Info = {
    hosts: [],
    port: 0,
    username: '[loading]',
    password: '[loading]',
    secure: true,
    auth: true,
  };
  let gamepadUI = false;
  let approot: HTMLElement;
  let tabs = [
    {
      icon: mdiTabletDashboard,
      label: 'Dash',
      component: Dash,
    },
    {
      icon: mdiFolderMultiple,
      label: 'Folders',
      component: Folders,
    },
    {
      icon: mdiCog,
      label: 'Config',
      component: Config,
    },
    {
      icon: mdiDesktopClassic,
      label: 'Guide',
      component: Guide,
    },
  ];
  let active = tabs[0];

  onMount(() => {
    const unlisten = electronAPI.onInfo((value) => {
      info = value;
    });
    electronAPI.getInfo();

    return unlisten;
  });

  onMount(() => {
    const unlisten = electronAPI.onGamepadUI((value) => {
      gamepadUI = value;

      if (gamepadUI) {
        document.body.classList.add('gamepadui');
      } else {
        document.body.classList.remove('gamepadui');
      }
    });
    electronAPI.getGamepadUI();

    return unlisten;
  });

  onMount(() => {
    const unlistenLB = gamepad.onButton('LB', ({ pressed }) => {
      if (pressed) {
        active = tabs[Math.max(tabs.indexOf(active) - 1, 0)];
      }
    });
    const unlistenRB = gamepad.onButton('RB', ({ pressed }) => {
      if (pressed) {
        active = tabs[Math.min(tabs.indexOf(active) + 1, tabs.length - 1)];
      }
    });

    return () => {
      unlistenLB();
      unlistenRB();
    };
  });

  onMount(() => {
    SpatialNavigation.init();
    SpatialNavigation.add('app', {
      selector: 'a, button, input, select, [tabindex="0"]',
    });
    SpatialNavigation.setDefaultSection('app');
    SpatialNavigation.focus();

    // Pause on keyboard events so that SpatialNavigation will only move focus
    // when we tell it to.
    const pause = () => SpatialNavigation.pause();
    const resume = () => SpatialNavigation.resume();
    approot.addEventListener('keydown', pause);
    approot.addEventListener('keyup', pause);
    window.addEventListener('keydown', resume);
    window.addEventListener('keyup', resume);

    const go = (direction: string) => {
      if (!document.activeElement || document.activeElement === document.body) {
        SpatialNavigation.focus();
      } else {
        SpatialNavigation.move(direction);
      }
    };

    const unlistenUp = gamepad.onButton('Up', ({ pressed }) => {
      if (pressed) {
        go('up');
      }
    });
    const unlistenDown = gamepad.onButton('Down', ({ pressed }) => {
      if (pressed) {
        go('down');
      }
    });
    const unlistenLeft = gamepad.onButton('Left', ({ pressed }) => {
      if (pressed) {
        go('left');
      }
    });
    const unlistenRight = gamepad.onButton('Right', ({ pressed }) => {
      if (pressed) {
        go('right');
      }
    });

    const unlistenLVer = gamepad.onAxis('LVer', ({ value, changedRegion }) => {
      if (changedRegion && value < 0) {
        go('up');
      } else if (changedRegion && value > 0) {
        go('down');
      }
    });
    const unlistenLHor = gamepad.onAxis('LHor', ({ value, changedRegion }) => {
      if (changedRegion && value < 0) {
        go('left');
      } else if (changedRegion && value > 0) {
        go('right');
      }
    });

    const scroll = (direction: 'up' | 'down') => {
      let element = document.activeElement;
      if (element == null) {
        return;
      }
      element = element.parentElement;
      while (element) {
        if (element.scrollHeight > element.clientHeight) {
          element.scrollBy({
            top: 100 * (direction === 'up' ? -1 : 1),
            behavior: 'smooth',
          });
        }
        element = element.parentElement;
      }
    };
    let scrollTimeout: NodeJS.Timeout | null = null;

    const unlistenRVer = gamepad.onAxis('RVer', ({ value, changedRegion }) => {
      if (value === 0) {
        if (scrollTimeout != null) {
          clearTimeout(scrollTimeout);
          scrollTimeout = null;
        }
        return;
      }
      if (changedRegion) {
        if (scrollTimeout != null) {
          clearTimeout(scrollTimeout);
          scrollTimeout = null;
        }
        const doScroll = () => {
          scrollTimeout = setTimeout(doScroll, 150);
          scroll(value < 0 ? 'up' : 'down');
        };
        scrollTimeout = setTimeout(doScroll, 600);
        scroll(value < 0 ? 'up' : 'down');
      }
    });

    return () => {
      SpatialNavigation.uninit();
      approot.removeEventListener('keydown', pause);
      approot.removeEventListener('keyup', pause);
      window.removeEventListener('keydown', resume);
      window.removeEventListener('keyup', resume);
      unlistenUp();
      unlistenDown();
      unlistenLeft();
      unlistenRight();
      unlistenLVer();
      unlistenLHor();
      unlistenRVer();
    };
  });

  onMount(() => {
    const unlistenA = gamepad.onButton('A', ({ pressed }) => {
      if (pressed) {
        if (document.activeElement) {
          if (document.activeElement.tagName === 'INPUT') {
            electronAPI.openKeyboard();
          }

          if ('click' in document.activeElement) {
            (document.activeElement as HTMLButtonElement).click();
          }
        }
      }
    });

    return () => {
      unlistenA();
    };
  });
</script>
