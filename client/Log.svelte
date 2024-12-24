<div
  style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 1em"
>
  <div>This log shows what's happening with your shares.</div>
  <div
    style="flex-basis: 0; flex-grow: 1; display: flex; flex-direction: column;"
  >
    <Paper
      variant="outlined"
      style="flex-basis: 0; flex-grow: 1; overflow: auto; background-color: #111; color-scheme: dark;"
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
    <Button variant="outlined" onclick={scrollToBottom}>
      <Label>Scroll to Bottom</Label>
    </Button>
    <Button variant="outlined" onclick={() => (logs = [])}>
      <Label>Clear Log</Label>
    </Button>
    <Button
      variant="outlined"
      onclick={() =>
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

  let {
    electronAPI,
    logging,
    logs = $bindable(),
  }: {
    electronAPI: ElectronAPI;
    logging: boolean | undefined;
    logs: [string, string][];
  } = $props();

  let output: Paper;

  $effect(() => {
    if (logs.length && output) {
      const el = output.getElement();
      const isHidden = el.clientHeight < 60;
      const isScrolledDown =
        el.scrollTop >= el.scrollHeight - el.clientHeight - 48;

      if (isHidden || isScrolledDown) {
        tick().then(() => {
          scrollToBottom();
        });
      }
    }
  });

  function scrollToBottom() {
    if (output) {
      const el = output.getElement();
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }
</script>
