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
        <Textfield bind:value={info.username} label="Username" />
      </div>
      <div>
        <Textfield bind:value={info.password} label="Password" />
      </div>
    </div>

    <div
      style="display: flex; flex-direction: column; justify-content: space-between;"
    >
      <div>
        <Textfield
          bind:value={info.port}
          type="number"
          input$min={1000}
          input$max={65535}
          label="Port"
        >
          <HelperText slot="helper">
            You usually won't need to change this.
          </HelperText>
        </Textfield>
      </div>
      <div>
        <FormField>
          <Switch bind:checked={info.secure} />
          <span slot="label">TLS Encryption</span>
        </FormField>
      </div>
    </div>
  </div>

  {#if !info.secure}
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
      variant="raised"
      disabled={info.username.trim() === '' ||
        info.password.trim() === '' ||
        info.port < 1000 ||
        info.port > 65535}
      on:click={() => electronAPI.startServer(info)}
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

  onMount(() => {
    electronAPI.onInfo((value) => {
      info = value;
    });
    electronAPI.getInfo();
  });
</script>
