<div
  style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;"
>
  <div>
    <Paper variant="outlined">
      <Content>
        {#if info.hosts.length}
          {#each info.hosts as host (host.address)}
            <div>
              WebDAV Address{#if info.hosts.length > 1}
                ({host.name}){/if}:
              <code
                >http{info.secure
                  ? 's'
                  : ''}://{host.address}:{info.port}/</code
              >
            </div>
          {/each}
          {#if info.auth}
            <div>
              Username: <code>{info.username}</code>
            </div>
            <div>
              Password: <code>{info.password}</code>
            </div>
          {/if}
        {:else}
          <div>WebDAV server is not running.</div>
        {/if}
      </Content>
    </Paper>
  </div>

  <div
    style="display: flex; flex-direction: row; justify-content: end; align-items: center; gap: 1em;"
  >
    <div
      style="flex-grow: 1; font-size: 0.7rem; line-height: 1rem; opacity: 0.5;"
    >
      {pkg.name}
      {pkg.version}
      <br />
      Check out
      <a href="https://port87.com" target="_blank"
        >Port87: A new kind of email.</a
      >
    </div>
    {#if info.hosts.length || info.port !== 0}
      <Button
        variant="outlined"
        onclick={() =>
          info.hosts.length
            ? electronAPI.stopServer()
            : electronAPI.startServer($state.snapshot(info))}
      >
        <Label>{info.hosts.length ? 'Stop' : 'Start'} Server</Label>
      </Button>
    {/if}
    <Button variant="outlined" color="secondary" onclick={() => window.close()}>
      <Label>Exit</Label>
    </Button>
  </div>
</div>

<script lang="ts">
  import Paper, { Content } from '@smui/paper';
  import Button, { Label } from '@smui/button';
  import type { ElectronAPI, Info } from '../server/preload.js';

  let {
    pkg,
    electronAPI,
    info,
  }: { pkg: any; electronAPI: ElectronAPI; info: Info } = $props();
</script>
