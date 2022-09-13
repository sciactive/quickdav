<div style="text-align: center;">
  <img src="logo.png" alt="QuickDAV Logo" />
</div>

<h5 style="margin: 1em 0;">Connecting to QuickDAV</h5>
<p>
  Please note that the address entered in the screenshots may be different than
  your address.
</p>

<div class="accordion-container">
  <Accordion class="guide-panels" multiple>
    <Panel
      variant="outlined"
      color="primary"
      extend
      bind:open={panelOpenWindows}
    >
      <Header>Windows</Header>
      <Content>
        <Accordion multiple>
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
                    >https://winscp.net</code
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
        <Accordion multiple>
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
            <Content>
              <ol>
                <li>
                  Open a new Dolphin window and click the address bar near the
                  top.
                  <br />
                  <img
                    src="screens/Linux-KDE/1.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  Type
                  <code>webdavs://{host.address}:{info.port}/</code>. You may
                  see the dialogs in the following steps come up before you
                  finish typing, so complete those steps if you do. Then, hit
                  the Enter key.
                  <br />
                  <img
                    src="screens/Linux-KDE/2.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You'll see a warning about the server's certificate. This is
                  because it is a self signed certificate. (Don't worry, there's
                  no danger in using a self signed certificate on your own
                  network.) Click <code>Continue</code>.
                  <br />
                  <img
                    src="screens/Linux-KDE/3.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You'll be asked how long to accept the certificate. A new
                  certificate is generated every time you open QuickDAV, so
                  click <code>Current Session only</code>.
                  <br />
                  <img
                    src="screens/Linux-KDE/4.png"
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
                  <code>OK</code>.
                  <br />
                  <img
                    src="screens/Linux-KDE/5.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device.
                  <br />
                  <img
                    src="screens/Linux-KDE/6.png"
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
      <Header>iPhone/iPad</Header>
      <Content>
        <ol>
          <li>
            We recommend the <code>ES File Explorer</code> app from the
            <code>App Store</code>.
            <br />
            <img src="screens/iOS/1.png" alt="Instruction screenshot." />
          </li>
          <li>
            Open the app and tap <code>OK</code> to allow the app to communicate
            over your network.
            <br />
            <img src="screens/iOS/2.png" alt="Instruction screenshot." />
          </li>
          <li>
            Tap the
            <code>Services</code> tab at the bottom, then tap the
            <code>WebDAV</code> item from the list.
            <br />
            <img src="screens/iOS/3.png" alt="Instruction screenshot." />
          </li>
          <li>
            Enter the following information:
            <ul>
              <li>
                URL:
                <code>{host.address}</code>
              </li>
              <li>
                Account:
                <code>{info.username}</code>
              </li>
              <li>
                Password:
                <code>{info.password}</code>
              </li>
              <li>
                Port:
                <code>{info.port}</code>
              </li>
              <li>
                HTTPS:
                <code>On</code>
              </li>
            </ul>
            Click
            <code>Connect</code>.
            <br />
            <img src="screens/iOS/4.png" alt="Instruction screenshot." />
          </li>
          <li>
            You should now be connected to your device.
            <br />
            <img src="screens/iOS/5.png" alt="Instruction screenshot." />
          </li>
        </ol>
      </Content>
    </Panel>
    <Panel variant="outlined" color="primary" extend>
      <Header>Android</Header>
      <Content>
        <ol>
          <li>
            We recommend the <code>Cx File Explorer</code> app from the
            <code>Play Store</code>.
            <br />
            <img src="screens/Android/1.png" alt="Instruction screenshot." />
          </li>
          <li>
            Open the app and walk through the intro, giving permission for <code
              >All files access</code
            >.
            <br />
            <img src="screens/Android/2.png" alt="Instruction screenshot." />
          </li>
          <li>
            Tap the <code>NETWORK</code> tab, then tap the
            <code>New location</code> button.
            <br />
            <img src="screens/Android/3.png" alt="Instruction screenshot." />
          </li>
          <li>
            Tap the <code>REMOTE</code> tab, then tap the <code>WebDAV</code>
            item in the list.
            <br />
            <img src="screens/Android/4.png" alt="Instruction screenshot." />
          </li>
          <li>
            Enter the following information:
            <ul>
              <li>
                Host:
                <code>{host.address}</code>
              </li>
              <li>
                Port:
                <code>{info.port}</code>
              </li>
              <li>
                Check <code>https</code>
              </li>
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
            <code>OK</code>.
            <br />
            <img src="screens/Android/5.png" alt="Instruction screenshot." />
          </li>
          <li>
            You should now be connected to your device.
            <br />
            <img src="screens/Android/6.png" alt="Instruction screenshot." />
          </li>
        </ol>
      </Content>
    </Panel>
  </Accordion>
</div>

<h5 style="margin: 1em 0;">Launch Options</h5>

<div style="font-size: smaller; margin-top: 1em;">
  QuickDAV supports the following environment variables to set the
  configuration:

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
  QuickDAV also supports the following environment variables to force certain
  options:

  <ul>
    <li><code>DARK_MODE</code> - Force dark mode. ("on" or "off")</li>
    <li>
      <code>GAMEPADUI</code> - Force gamepad UI. Gamepad UI is automatically enabled
      if QuickDAV is launched from Steam. ("on" or "off")
    </li>
    <li><code>WIDTH</code> - Set the window width.</li>
    <li><code>HEIGHT</code> - Set the window height.</li>
  </ul>
</div>

<div style="font-size: smaller; margin-top: 1em;">
  Copyright &copy; 2022 SciActive Inc. All Rights Reserved.
</div>

<div style="font-size: smaller; margin-top: 1em;">
  Xbox Series Button Icons and Controls - Zacksly Licensed under CC BY 3.0 -
  https://zacksly.itch.io (Modified by SciActive, Inc)
</div>

<script lang="ts">
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import type { Info } from '../server/preload.js';

  export let info: Info;

  $: host = info.hosts[0] || { address: 'device-ip-address' };

  let panelOpenWindows = false;
  let panelOpenLinux = false;
</script>
