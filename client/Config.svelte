<div
  style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;"
>
  <div
    style="display: flex; flex-direction: row; justify-content: space-between; flex-wrap: wrap;"
  >
    <div
      style="display: flex; flex-direction: column; justify-content: space-between;"
    >
      <div>
        <Textfield bind:value={editInfo.username} label="Username" required />
      </div>
      <div>
        <Textfield bind:value={editInfo.password} label="Password" required />
      </div>
    </div>

    <div
      style="display: flex; flex-direction: column; justify-content: space-between;"
    >
      <div>
        <Textfield
          bind:value={editInfo.port}
          type="number"
          input$min={1000}
          input$max={65535}
          required
          label="Port"
        >
          <HelperText slot="helper">
            You usually won't need to change this.
          </HelperText>
        </Textfield>
      </div>
      <div>
        <FormField>
          <Switch bind:checked={editInfo.secure} />
          <span slot="label">TLS Encryption</span>
        </FormField>
      </div>
    </div>
  </div>

  {#if !editInfo.secure}
    <div
      class="mdc-typography--caption"
      style="display: flex; flex-direction: row; align-items: center; font-size: x-small; margin: 1em 0;"
    >
      <svg
        viewBox="0 0 24 24"
        style="width: 12px; height: 12px; padding: 12px;"
      >
        <path fill="currentColor" d={mdiExclamationThick} />
      </svg>
      <span>
        By turning off TLS encryption, all of your network traffic will be
        visible to anyone who has access to your network.
      </span>
    </div>
  {/if}

  <div style="display: flex; flex-direction: row; justify-content: end;">
    <Button
      variant="outlined"
      disabled={preventSubmit}
      on:click={() => electronAPI.startServer(editInfo)}
    >
      <Label>Save and Restart Server</Label>
    </Button>
  </div>
</div>

<script lang="ts">
  import { mdiExclamationThick } from '@mdi/js';
  import { onMount } from 'svelte';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Switch from '@smui/switch';
  import FormField from '@smui/form-field';
  import type { ElectronAPI, Info } from '../server/preload.js';

  export let electronAPI: ElectronAPI;

  let info: Info = {
    hosts: [],
    port: 0,
    username: 'loading',
    password: 'loading',
    secure: true,
  };

  let editInfo: Info = { ...info };

  $: preventSubmit =
    editInfo.username.trim() === '' ||
    editInfo.password.trim() === '' ||
    editInfo.port < 1000 ||
    editInfo.port > 65535 ||
    (editInfo.port === info.port &&
      editInfo.username === info.username &&
      editInfo.password === info.password &&
      editInfo.secure === info.secure);

  onMount(() => {
    electronAPI.onInfo((value) => {
      info = value;
      editInfo = { ...info };
    });
    electronAPI.getInfo();
  });
</script>
