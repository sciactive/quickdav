<div
  style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;"
>
  <div>
    {#each hosts as host (host.address)}
      <div>
        davs://{host.address}:{host.port}/
        {#if hosts.length > 1}
          on {host.name}
        {/if}
      </div>
    {/each}
  </div>

  <div style="display: flex; flex-direction: row; justify-content: end;">
    <Button variant="raised" on:click={() => window.close()}>
      <Label>Exit</Label>
    </Button>
  </div>
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import Button, { Label } from '@smui/button';
  import type { ElectronAPI, Hosts } from '../server/preload.js';

  export let electronAPI: ElectronAPI;

  let hosts: Hosts = [];

  onMount(() => {
    electronAPI.onHosts((value) => {
      hosts = value;
    });
    electronAPI.getHosts();
  });
</script>
