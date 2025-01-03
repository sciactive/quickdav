<div
  style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 100%;"
>
  <div
    style="display: flex; flex-direction: column; max-width: 800px; width: 100%;"
  >
    <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
      <div
        style="display: flex; flex-direction: column; margin-inline-end: 25px;"
      >
        <div>
          <Textfield
            bind:value={editInfo.username}
            label="Username"
            required
            onfocus={() => (textInputFocused = true)}
            onblur={() => (textInputFocused = false)}
          />
        </div>
        <div>
          <Textfield
            bind:value={editInfo.password}
            label="Password"
            required
            onfocus={() => (textInputFocused = true)}
            onblur={() => (textInputFocused = false)}
          />
        </div>
      </div>

      <div style="display: flex; flex-direction: column;">
        <div>
          <Textfield
            bind:value={editInfo.port}
            type="number"
            input$min={1000}
            input$max={65535}
            required
            label="Port"
            onfocus={() => (textInputFocused = true)}
            onblur={() => (textInputFocused = false)}
          >
            {#snippet helper()}
              <HelperText>You usually won't need to change this.</HelperText>
            {/snippet}
          </Textfield>
        </div>
        <div>
          <FormField>
            <Switch bind:checked={editInfo.secure} />
            {#snippet label()}
              Self Signed TLS Encryption
            {/snippet}
          </FormField>
        </div>
        <div>
          <FormField>
            <Switch bind:checked={editInfo.auth} />
            {#snippet label()}
              Password Required
            {/snippet}
          </FormField>
        </div>
        <div>
          <FormField>
            <Switch bind:checked={editInfo.readonly} />
            {#snippet label()}
              Read Only
            {/snippet}
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
          style="width: 1em; height: 1em; padding-right: 1em;"
        >
          <path fill="currentColor" d={mdiExclamationThick} />
        </svg>
        <span>
          Turning off TLS encryption is less secure, so don't do this on public
          WiFi networks. This should only be necessary for connecting with
          Windows Explorer.
        </span>
      </div>
    {/if}
  </div>

  <div
    style="display: flex; flex-direction: row; justify-content: space-between; gap: 1em; width: 100%;"
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
      onclick={() => {
        loading = true;
        electronAPI.startServer($state.snapshot(editInfo));
      }}
    >
      <Label>Save and Restart Server</Label>
    </Button>
  </div>
</div>

<script lang="ts">
  import { mdiExclamationThick, mdiKeyboard } from '@mdi/js';
  import { onMount } from 'svelte';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Switch from '@smui/switch';
  import FormField from '@smui/form-field';
  import type { ElectronAPI, Info } from '../server/preload.js';
  import AButton from './controller-icons/A.svelte';

  let {
    electronAPI,
    info,
    gamepadUI = false,
  }: {
    electronAPI: ElectronAPI;
    info: Info;
    gamepadUI: boolean;
  } = $props();

  let editInfo: Info = $state({ ...info });
  let textInputFocused = $state(false);
  let loading = $state(false);

  const preventSubmit = $derived(
    loading ||
      editInfo.username.trim() === '' ||
      editInfo.password.trim() === '' ||
      editInfo.port < 1000 ||
      editInfo.port > 65535 ||
      (editInfo.port === info.port &&
        editInfo.username === info.username &&
        editInfo.password === info.password &&
        editInfo.secure === info.secure &&
        editInfo.auth === info.auth &&
        editInfo.readonly === info.readonly),
  );

  onMount(() => {
    return electronAPI.onInfo((value) => {
      loading = false;
      editInfo = { ...value };
    });
  });
</script>
