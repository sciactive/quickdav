<div
  style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 100%;"
>
  <div
    style="display: flex; flex-direction: column; max-width: 800px; width: 100%;"
  >
    These are the folders on this computer you are sharing. You can change which
    folders you're sharing here, and access them from your connected devices.
    <List nonInteractive>
      {#each editFolders as folder, i}
        <Item>
          <Text>
            {folder}
          </Text>
          {#if editFolders.length > 1}
            <Meta>
              <IconButton onclick={() => removeFolder(i)} title="Remove folder">
                <Icon tag="svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiMinus} />
                </Icon>
              </IconButton>
            </Meta>
          {/if}
        </Item>
        <Separator />
      {/each}
    </List>
    <div style="display: flex; flex-direction: row; justify-content: center;">
      <IconButton onclick={() => addFolder()} title="Add folder">
        <Icon tag="svg" viewBox="0 0 24 24">
          <path fill="currentColor" d={mdiPlus} />
        </Icon>
      </IconButton>
    </div>
  </div>

  <div
    style="display: flex; flex-direction: row; justify-content: flex-end; gap: 1em; width: 100%;"
  >
    <Button
      variant="outlined"
      disabled={preventSubmit}
      onclick={() => {
        loading = true;
        electronAPI.setFolders($state.snapshot(editFolders));
      }}
    >
      <Label>Save Changes</Label>
    </Button>
  </div>
</div>

<script lang="ts">
  import { mdiMinus, mdiPlus } from '@mdi/js';
  import { onMount } from 'svelte';
  import List, { Item, Meta, Text, Separator } from '@smui/list';
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';
  import type { ElectronAPI } from '../server/preload.js';

  let { electronAPI }: { electronAPI: ElectronAPI } = $props();

  let folders: string[] = $state([]);
  // svelte-ignore state_referenced_locally
  let editFolders = $state([...folders]);
  let loading = $state(false);

  const preventSubmit = $derived(
    loading || JSON.stringify(editFolders) === JSON.stringify(folders),
  );

  onMount(() => {
    const unlisten = electronAPI.onFolders((value) => {
      loading = false;
      folders = [...value];
      editFolders = [...folders];
    });
    electronAPI.getFolders();

    return unlisten;
  });

  onMount(() => {
    const unlisten = electronAPI.onOpenedFolders((value) => {
      editFolders = Array.from(new Set([...editFolders, ...value]));
    });

    return unlisten;
  });

  function removeFolder(i: number) {
    editFolders.splice(i, 1);
  }

  function addFolder() {
    electronAPI.openFoldersDialog('Add Folder(s) to Server');
  }
</script>
