<div
  style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 1em"
>
  <div>This log shows what's happening with your shares.</div>
  <div
    style="flex-basis: 0; flex-grow: 1; display: flex; flex-direction: column;"
  >
    <Paper
      variant="outlined"
      style="flex-basis: 0; flex-grow: 1; overflow: auto; background-color: #111;"
      bind:this={output}
    >
      <Content>
        <pre style="margin: 0;">{#each logs as log, i (i)}<div
              style="color: {log[0]};">{log[1]}</div>{/each}</pre>
      </Content>
    </Paper>
  </div>

  <div
    style="display: flex; flex-direction: row; justify-content: end; align-items: center; gap: 1em;"
  >
    <Button variant="outlined" on:click={() => (logs = [])}>
      <Label>Clear Log</Label>
    </Button>
    <Button
      variant="outlined"
      on:click={() =>
        logging ? electronAPI.stopLogging() : electronAPI.startLogging()}
    >
      <Label>{logging ? 'Stop' : 'Start'} Logging</Label>
    </Button>
  </div>
</div>

<script lang="ts">
  import { tick } from 'svelte';
  import Paper, { Content } from '@smui/paper';
  import Button, { Label } from '@smui/button';
  import type { ElectronAPI } from '../server/preload.js';

  export let electronAPI: ElectronAPI;
  export let logging: boolean | undefined;
  export let logs: [string, string][];

  let output: Paper;

  $: if (logs && output) {
    const el = output.getElement();
    const isScrolledDown =
      el.scrollTop >= el.scrollHeight - el.clientHeight - 10;

    if (isScrolledDown) {
      tick().then(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }
</script>
