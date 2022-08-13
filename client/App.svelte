<div style="display: flex; flex-direction: column; height: 100%;">
  <div>
    <TabBar {tabs} let:tab bind:active>
      <Tab {tab}>
        <Icon component={Svg} viewBox="0 0 24 24">
          <path fill="currentColor" d={tab.icon} />
        </Icon>
        <Label>{tab.label}</Label>
      </Tab>
    </TabBar>
  </div>

  <div style="padding: 1.2rem; flex-grow: 1; overflow: auto;">
    <svelte:component this={active.component} {electronAPI} />
  </div>
</div>

<script lang="ts">
  import { mdiTabletDashboard, mdiCog, mdiDesktopClassic } from '@mdi/js';
  import Tab, { Icon, Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import { Svg } from '@smui/common/elements';
  import type { ElectronAPI } from '../server/preload.js';
  import Dash from './Dash.svelte';
  import Config from './Config.svelte';
  import Guide from './Guide.svelte';

  export let electronAPI: ElectronAPI;

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
</script>
