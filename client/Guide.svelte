<h5 style="margin: 1em 0;">Connecting to Quick DAV</h5>

<div class="accordion-container">
  <Accordion>
    <Panel
      variant="outlined"
      color="primary"
      extend
      bind:open={panelOpenWindows}
    >
      <Header>Windows</Header>
      <Content>
        <Accordion>
          <Panel variant="outlined" color="secondary" extend>
            <Header tabindex={panelOpenWindows ? 0 : -1}
              >Explorer <span slot="description">Built In</span></Header
            >
            <Content>
              <div class="mdc-typography--caption" style="text-align: center;">
                Built in to Windows. Encryption/password not supported.
              </div>
              win explorer
            </Content>
          </Panel>
          <Panel variant="outlined" color="secondary" extend>
            <Header tabindex={panelOpenWindows ? 0 : -1}
              >WinSCP <span slot="description">Free Download</span></Header
            >
            <Content>
              <div class="mdc-typography--caption" style="text-align: center;">
                Free and open source download. Encryption/password supported.
              </div>
              winscp</Content
            >
          </Panel>
        </Accordion>
      </Content>
    </Panel>
    <Panel variant="outlined" color="primary" extend>
      <Header>macOS</Header>
      <Content>macos</Content>
    </Panel>
    <Panel variant="outlined" color="primary" extend bind:open={panelOpenLinux}>
      <Header>Linux</Header>
      <Content>
        <Accordion>
          <Panel variant="outlined" color="secondary" extend>
            <Header tabindex={panelOpenLinux ? 0 : -1}>Gnome</Header>
            <Content>linux gnome</Content>
          </Panel>
          <Panel variant="outlined" color="secondary" extend>
            <Header tabindex={panelOpenLinux ? 0 : -1}>KDE</Header>
            <Content>linux kde</Content>
          </Panel>
        </Accordion>
      </Content>
    </Panel>
    <Panel variant="outlined" color="primary" extend>
      <Header>iPhone/iPad</Header>
      <Content>ios</Content>
    </Panel>
    <Panel variant="outlined" color="primary" extend>
      <Header>Android</Header>
      <Content>android</Content>
    </Panel>
  </Accordion>
</div>

<h5 style="margin: 1em 0;">Launch Options</h5>

<div style="font-size: smaller; margin-top: 1em;">
  Quick DAV supports the following launch options to set the configuration:

  <ul>
    <li><code>DAV_PORT</code> - The port to listen on.</li>
    <li><code>DAV_USERNAME</code> - The authentication username.</li>
    <li><code>DAV_PASSWORD</code> - The authentication password.</li>
    <li>
      <code>DAV_TLS</code> - Whether to use self signed TLS encryption. (Set to "off"
      to disable.)
    </li>
    <li>
      <code>DAV_AUTH</code> - Whether to require a username and password. (Set to
      "off" to disable.)
    </li>
  </ul>
</div>

<div style="font-size: smaller; margin-top: 1em;">
  Copyright &copy; 2022 SciActive Inc. All Rights Reserved.
</div>

<div style="font-size: smaller; margin-top: 1em;">
  Xbox Series Button Icons and Controls - Zacksly Licensed under CC BY 3.0 -
  https://zacksly.itch.io
</div>

<script lang="ts">
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

  let panelOpenWindows = false;
  let panelOpenLinux = false;
</script>
