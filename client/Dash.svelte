<div
  style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;"
>
  <div>
    <Paper variant="outlined">
      <Content>
        {#if info.hosts.length}
          {#each info.hosts as host (host.address)}
            <div>
              WebDAV Address{#if info.hosts.length > 1} ({host.name}){/if}:
              <code>{host.address}:{info.port}</code>
            </div>
          {/each}
          <div>
            Username: <code>{info.username}</code>
          </div>
          <div>
            Password: <code>{info.password}</code>
          </div>
        {:else}
          <div>WebDAV server is not running.</div>
        {/if}
      </Content>
    </Paper>
  </div>

  <div style="display: flex; flex-direction: row; justify-content: end;">
    {#if info.hosts.length || info.port !== 0}
      <Button
        variant="raised"
        on:click={() =>
          info.hosts.length
            ? electronAPI.stopServer()
            : electronAPI.startServer(info)}
      >
        <Label>{info.hosts.length ? 'Stop' : 'Start'} Server</Label>
      </Button>
    {/if}
    <Button
      style="margin-left: 1em;"
      variant="raised"
      color="secondary"
      on:click={() => window.close()}
    >
      <Label>Exit</Label>
    </Button>
  </div>
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import Paper, { Content } from '@smui/paper';
  import Button, { Label } from '@smui/button';
  import type { ElectronAPI, Info } from '../server/preload.js';

  export let electronAPI: ElectronAPI;

  let info: Info = {
    hosts: [],
    port: 0,
    username: 'loading',
    password: 'loading',
    secure: true,
  };

  onMount(() => {
    electronAPI.onInfo((value) => {
      info = value;
    });
    electronAPI.getInfo();
  });
</script>
