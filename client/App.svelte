<h1>Quick DAV</h1>

{#each hosts as host (host.address)}
  <div>
    davs://{host.address}:{host.port}/
    {#if hosts.length > 1}
      on {host.name}
    {/if}
  </div>
{/each}

<script lang="ts">
  import { onMount } from 'svelte';
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
