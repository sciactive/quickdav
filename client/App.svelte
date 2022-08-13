<div style="display: flex; flex-direction: column; height: 100%;">
  <div
    bind:this={tabBarContainer}
    style="display: flex; flex-direction: row; align-items: center; width: 100%;"
  >
    <div style="padding: 0 .75em;">
      <img
        alt="Left bumper button"
        src="controller-icons/Left%20Bumper.svg"
        height="30px"
      />
    </div>
    <TabBar {tabs} let:tab bind:active style="flex-grow: 1;">
      <Tab {tab}>
        <Icon component={Svg} viewBox="0 0 24 24">
          <path fill="currentColor" d={tab.icon} />
        </Icon>
        <Label>{tab.label}</Label>
      </Tab>
    </TabBar>
    <div style="padding: 0 .75em;">
      <img
        alt="Right bumper button"
        src="controller-icons/Right%20Bumper.svg"
        height="30px"
      />
    </div>
  </div>

  <div style="padding: 1.2rem; flex-grow: 1; overflow: auto;">
    <svelte:component this={active.component} {electronAPI} />
  </div>
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import { mdiTabletDashboard, mdiCog, mdiDesktopClassic } from '@mdi/js';
  import Tab, { Icon, Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import { Svg } from '@smui/common/elements';
  import type { ElectronAPI } from '../server/preload.js';
  import Dash from './Dash.svelte';
  import Config from './Config.svelte';
  import Guide from './Guide.svelte';
  import gamepad from './gamepad.js';

  export let electronAPI: ElectronAPI;

  let tabBarContainer: HTMLElement;
  let tabs = [
    {
      icon: mdiTabletDashboard,
      label: 'Dash',
      component: Dash,
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
    tabBarContainer.querySelector<HTMLButtonElement>('.mdc-tab')?.focus();

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
</script>
