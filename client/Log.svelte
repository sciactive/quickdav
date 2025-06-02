<svelte:window onresize={render} />

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
      onscroll={render}
    >
      <Content style="position: relative;">
        <div
          style="height: {logSpacerHeight}px; width: {logSpacerWidth}px;"
        ></div>
        <div
          bind:this={logViewer}
          class="mdc-typography--body2"
          style="position: absolute; font-family: monospace; margin: 0; top: {start *
            lineHeight}px;"
        >
          {#each logs.slice(start, end) as line}
            <!-- prettier-ignore -->
            <div style="white-space: pre; color: {calculateColor(line)};">{line}</div>
          {/each}
        </div>
      </Content>
    </Paper>
  </div>

  <div
    style="display: flex; flex-direction: row; justify-content: end; align-items: center; gap: 1em;"
  >
    <Button variant="outlined" onclick={scrollToBottom}>
      <Label>Scroll to Bottom</Label>
    </Button>
    <Button
      variant="outlined"
      onclick={() => {
        logs = [];
        logSpacerWidth = 1;
      }}
    >
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
  import { onMount, tick } from 'svelte';
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
    logs: string[];
  } = $props();

  let output: Paper;
  let logViewer: HTMLDivElement;
  let logSpacerHeight = $state(0);
  let logSpacerWidth = $state(0);
  let lineHeight = $state(20);
  let start = $state(0);
  let end = $state(0);

  onMount(() => {
    lineHeight = parseFloat(window.getComputedStyle(logViewer).lineHeight);
    if (isNaN(lineHeight)) {
      lineHeight = 20;
    }
  });

  $effect.pre(() => {
    if (logs.length && output) {
      const el = output.getElement();
      const isHidden = el.clientHeight < 60;
      const isScrolledDown =
        el.scrollTop >= el.scrollHeight - el.clientHeight - 48;

      logSpacerHeight = logs.length * lineHeight;

      if (isHidden || isScrolledDown) {
        tick().then(() => {
          scrollToBottom();
          render();
        });
      }
    } else {
      logSpacerHeight = 0;
    }
  });

  function render() {
    const el = output.getElement();

    const visibleLines = el.clientHeight / lineHeight;
    start = Math.max(Math.floor(el.scrollTop / lineHeight) - 4, 0);
    end = Math.min(start + visibleLines + 8, logs.length);

    tick().then(() => {
      logSpacerWidth = Math.max(logViewer.clientWidth, logSpacerWidth);
    });
  }

  function scrollToBottom() {
    if (output) {
      const el = output.getElement();
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }

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
</script>
