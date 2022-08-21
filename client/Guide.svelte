<h5 style="margin: 1em 0;">Connecting to Quick DAV</h5>
<p>
  Please note that the address entered in the screenshots may be different from
  your address.
</p>

<div class="accordion-container">
  <Accordion class="guide-panels">
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

              <ol>
                <li>
                  Switch to the Config tab and turn off <code
                    >Self Signed TLS Encryption</code
                  >
                  and <code>Password Required</code>, then select
                  <code>Save and Restart Server</code>.
                  <br />
                  <img
                    src="screens/Windows-Explorer/1.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  On your Windows computer, open a File Explorer window, click
                  on the address bar, and type <code
                    >http://{host.address}:{info.port}/</code
                  >. Hit the enter key.
                  <br />
                  <img
                    src="screens/Windows-Explorer/2.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device.
                  <br />
                  <img
                    src="screens/Windows-Explorer/3.png"
                    alt="Instruction screenshot."
                  />
                </li>
              </ol>
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

              <ol>
                <li>
                  Download and install WinSCP from <code
                    >https://winscp.net/</code
                  >.
                </li>
                <li>
                  Once installed, open WinSCP from your Start Menu, and click
                  the <code>New Session</code> tab, if the Login window doesn't
                  come up automatically.
                  <br />
                  <img
                    src="screens/Windows-WinSCP/1.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  Enter the following information:
                  <ul>
                    <li>File protocol: <code>WebDAV</code></li>
                    <li>
                      Encryption:
                      <code>TLS/SSL Implicit encryption</code>
                    </li>
                    <li>
                      Host name:
                      <code>{host.address}</code>
                    </li>
                    <li>
                      Port number:
                      <code>{info.port}</code>
                    </li>
                    <li>
                      User name:
                      <code>{info.username}</code>
                    </li>
                    <li>
                      Password:
                      <code>{info.password}</code>
                    </li>
                  </ul>
                  Click
                  <code>Login</code>.
                  <br />
                  <img
                    src="screens/Windows-WinSCP/2.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You'll see a warning about the server's certificate. This is
                  because it is a self signed certificate. (Don't worry, there's
                  no danger in using a self signed certificate on your own
                  network.) Click <code>Yes</code>.
                  <br />
                  <img
                    src="screens/Windows-WinSCP/3.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device.
                  <br />
                  <img
                    src="screens/Windows-WinSCP/4.png"
                    alt="Instruction screenshot."
                  />
                </li>
              </ol>
            </Content>
          </Panel>
        </Accordion>
      </Content>
    </Panel>
    <Panel variant="outlined" color="primary" extend>
      <Header>macOS</Header>
      <Content>
        <ol>
          <li>
            Open a new Finder window.
            <br />
            <img src="screens/macOS/1.png" alt="Instruction screenshot." />
          </li>
          <li>
            In the <code>Go</code> menu, select
            <code>Connect to Server...</code>.
            <br />
            <img src="screens/macOS/2.png" alt="Instruction screenshot." />
          </li>
          <li>
            Enter the address
            <code>https://{host.address}:{info.port}</code> and click
            <code>Connect</code>.
            <br />
            <img src="screens/macOS/3.png" alt="Instruction screenshot." />
          </li>
          <li>
            You'll see a warning about the server's certificate. This is because
            it is a self signed certificate. (Don't worry, there's no danger in
            using a self signed certificate on your own network.) Click <code
              >Continue</code
            >.
            <br />
            <img src="screens/macOS/4.png" alt="Instruction screenshot." />
          </li>
          <li>
            You may see a dialog box like this. Click <code>Connect</code>.
            <br />
            <img src="screens/macOS/5.png" alt="Instruction screenshot." />
          </li>
          <li>
            Enter the following information:
            <ul>
              <li>
                Name:
                <code>{info.username}</code>
              </li>
              <li>
                Password:
                <code>{info.password}</code>
              </li>
            </ul>
            Click
            <code>Connect</code>.
            <br />
            <img src="screens/macOS/6.png" alt="Instruction screenshot." />
          </li>
          <li>
            You should now be connected to your device.
            <br />
            <img src="screens/macOS/7.png" alt="Instruction screenshot." />
          </li>
        </ol>
      </Content>
    </Panel>
    <Panel variant="outlined" color="primary" extend bind:open={panelOpenLinux}>
      <Header>Linux</Header>
      <Content>
        <Accordion>
          <Panel variant="outlined" color="secondary" extend>
            <Header tabindex={panelOpenLinux ? 0 : -1}>Gnome</Header>
            <Content>
              <ol>
                <li>
                  Open a new Files window and click <code>Other Locations</code
                  >.
                  <br />
                  <img
                    src="screens/Linux-Gnome/1.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  In the <code>Connect to Server</code> text box, type
                  <code>davs://{host.address}:{info.port}/</code> and click
                  <code>Connect</code>.
                  <br />
                  <img
                    src="screens/Linux-Gnome/2.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You'll see a warning about the server's certificate. This is
                  because it is a self signed certificate. (Don't worry, there's
                  no danger in using a self signed certificate on your own
                  network.) Click <code>Yes</code>.
                  <br />
                  <img
                    src="screens/Linux-Gnome/3.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  Enter the following information:
                  <ul>
                    <li>
                      Username:
                      <code>{info.username}</code>
                    </li>
                    <li>
                      Password:
                      <code>{info.password}</code>
                    </li>
                  </ul>
                  Click
                  <code>Connect</code>.
                  <br />
                  <img
                    src="screens/Linux-Gnome/4.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device.
                  <br />
                  <img
                    src="screens/Linux-Gnome/5.png"
                    alt="Instruction screenshot."
                  />
                </li>
              </ol>
            </Content>
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
  import type { Info } from '../server/preload.js';

  export let info: Info;

  $: host = info.hosts[0] || { address: 'device-ip-address' };

  let panelOpenWindows = false;
  let panelOpenLinux = false;
</script>
