<div
  style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 100%;"
>
  <div
    style="display: flex; flex-direction: column; max-width: 800px; width: 100%;"
  >
    {#each editFolders as folder}
      <div>
        <Textfield
          bind:value={folder}
          label="Path"
          required
          style="width: 400px;"
          on:focus={() => (textInputFocused = true)}
          on:blur={() => (textInputFocused = false)}
        />
      </div>
    {/each}
  </div>

  <div
    style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;"
  >
    <div style="display: flex; flex-direction: row; align-items: center;">
      {#if textInputFocused && gamepadUI}
        <AButton height="30px" />
        <svg
          viewBox="0 0 24 24"
          style="width: 30px; height: 30px; padding-left: 12px;"
        >
          <path fill="currentColor" d={mdiKeyboard} />
        </svg>
      {/if}
    </div>
    <Button
      variant="outlined"
      disabled={preventSubmit}
      on:click={() => {
        loading = true;
        electronAPI.setFolders(editFolders);
      }}
    >
      <Label>Save Changes</Label>
    </Button>
  </div>
</div>

<script lang="ts">
  import { mdiKeyboard } from '@mdi/js';
  import { onMount } from 'svelte';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import type { ElectronAPI } from '../server/preload.js';
  import AButton from './controller-icons/A.svelte';

  export let electronAPI: ElectronAPI;
  export let gamepadUI = false;

  let folders: string[] = [];
  let editFolders = [...folders];
  let textInputFocused = false;
  let loading = false;

  $: preventSubmit =
    loading || JSON.stringify(editFolders) === JSON.stringify(folders);

  onMount(() => {
    const unlisten = electronAPI.onFolders((value) => {
      loading = false;
      folders = [...value];
      editFolders = [...folders];
    });
    electronAPI.getFolders();

    return unlisten;
  });
</script>
