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
    <TabBar {tabs} bind:active style="flex-grow: 1; flex-basis: 0; width: 0;">
      {#snippet tab(tab)}
        <Tab {tab}>
          <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={tab.icon} />
          </Icon>
          <Label>{tab.label}</Label>
        </Tab>
      {/snippet}
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
      <tab.component
        {pkg}
        {electronAPI}
        {info}
        {logging}
        bind:logs
        {gamepadUI}
      />
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
    mdiTimelineText,
    mdiDesktopClassic,
  } from '@mdi/js';
  import Tab, { Icon, Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import type { ElectronAPI, Info } from '../server/preload.js';
  import LeftBumper from './controller-icons/Left Bumper.svelte';
  import RightBumper from './controller-icons/Right Bumper.svelte';
  import Dash from './Dash.svelte';
  import Folders from './Folders.svelte';
  import Config from './Config.svelte';
  import Log from './Log.svelte';
  import Guide from './Guide.svelte';
  import gamepad from './gamepad.js';

  let {
    pkg,
    electronAPI,
  }: {
    pkg: any;
    electronAPI: ElectronAPI;
  } = $props();

  let info: Info = $state({
    hosts: [],
    port: 0,
    username: '[loading]',
    password: '[loading]',
    secure: true,
    auth: true,
    readonly: false,
  });
  let logging: boolean | undefined = $state();
  let logs: [string, string][] = $state([]);
  let gamepadUI = $state(false);
  let approot: HTMLElement;
  let tabs = $state([
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
      icon: mdiTimelineText,
      label: 'Log',
      component: Log,
    },
    {
      icon: mdiDesktopClassic,
      label: 'Guide',
      component: Guide,
    },
  ]);
  let active = $state(tabs[0]);

  onMount(() => {
    const unlisten = electronAPI.onInfo((value) => {
      info = value;
    });
    electronAPI.getInfo();

    return unlisten;
  });

  onMount(() => {
    const unlisten = electronAPI.onLogging((value) => {
      if (logging === undefined && value) {
        electronAPI.startLogging();
      }

      logging = value;
    });
    electronAPI.getLogging();

    return unlisten;
  });

  onMount(() => {
    function calculateColor(line: string) {
      const match = line.match(/^\[([^\]]+)\]/);
      if (!match) {
        return '#fff';
      }
      const redId = match[1];
      // Shuffle the chars for the other colors.
      const greenId = match[1].slice(-1) + match[1].slice(0, 1);
      const blueId = match[1].slice(-2) + match[1].slice(0, 2);

      // Convert IDs to numbers.
      const redNum = [...redId].reduce<number>(
        (tot, char) => tot + char.charCodeAt(0),
        0,
      );
      const greenNum = [...greenId].reduce<number>(
        (tot, char) => tot + char.charCodeAt(0),
        0,
      );
      const blueNum = [...blueId].reduce<number>(
        (tot, char) => tot + char.charCodeAt(0),
        0,
      );

      // Convert numbers to light colors.
      const red = ((redNum % 156) + 100).toString(16);
      const green = ((greenNum % 156) + 100).toString(16);
      const blue = ((blueNum % 156) + 100).toString(16);

      // And convert RGB to a hex color.
      return `#${('00' + red).slice(-2)}${('00' + green).slice(-2)}${(
        '00' + blue
      ).slice(-2)}`;
    }
    const unlisten = electronAPI.onLog((value) => {
      logs.push([calculateColor(value), value]);
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
