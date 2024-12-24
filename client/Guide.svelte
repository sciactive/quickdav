<div style="text-align: center;">
  <img src="logo.png" alt="QuickDAV Logo" />
</div>

<h5 style="margin: 1em 0;">Connecting to QuickDAV</h5>
<p>
  Please note that the address entered in the screenshots may be different than
  your address.
</p>
<p>
  For the best and safest experience, we recommend using QuickDAV only within
  your own home network or WiFi. Our security certificate is designed for
  in-home use, so connecting from a different location may not be secure. Please
  avoid setting up 'port forwarding' on your router to access QuickDAV from
  outside your home. Thank you!
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
            <Header tabindex={panelOpenWindows ? 0 : -1}>
              Explorer
              {#snippet description()}
                Built In
              {/snippet}
            </Header>
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
                  Make sure your Windows PC is on the same network as this
                  computer. On your Windows PC, open a File Explorer window,
                  click on the address bar, and type <code
                    >http://{host.address}:{info.port}/</code
                  >. Hit the enter key.
                  <br />
                  <img
                    src="screens/Windows-Explorer/2.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device and see your shared
                  folders. You can upload files to and download files from this
                  computer.
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
            <Header tabindex={panelOpenWindows ? 0 : -1}>
              WinSCP
              {#snippet description()}
                Free Download
              {/snippet}
            </Header>
            <Content>
              <div class="mdc-typography--caption" style="text-align: center;">
                Free and open source download. Encryption/password supported.
              </div>

              <ol>
                <li>
                  Make sure your Windows PC is on the same network as this
                  computer. Download and install WinSCP from <code
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
                  because it is a <a
                    href="https://en.wikipedia.org/wiki/Self-signed_certificate"
                    target="_blank">self signed certificate</a
                  >. (Don't worry, there's no danger in using a self signed
                  certificate on your own network.) Click <code>Yes</code>.
                  <br />
                  <img
                    src="screens/Windows-WinSCP/3.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device and see your shared
                  folders. You can upload files to and download files from this
                  computer.
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
            Make sure your Mac is on the same network as this computer. Open a
            new Finder window.
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
            it is a <a
              href="https://en.wikipedia.org/wiki/Self-signed_certificate"
              target="_blank">self signed certificate</a
            >. (Don't worry, there's no danger in using a self signed
            certificate on your own network.) Click <code>Continue</code>.
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
            You should now be connected to your device and see your shared
            folders. You can upload files to and download files from this
            computer.
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
                  Make sure your Linux PC is on the same network as this
                  computer. Open a new Files window and click <code
                    >Other Locations</code
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
                  because it is a <a
                    href="https://en.wikipedia.org/wiki/Self-signed_certificate"
                    target="_blank">self signed certificate</a
                  >. (Don't worry, there's no danger in using a self signed
                  certificate on your own network.) Click <code>Yes</code>.
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
                  You should now be connected to your device and see your shared
                  folders. You can upload files to and download files from this
                  computer.
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
                  Make sure your Linux PC is on the same network as this
                  computer. Open a new Dolphin window and click the address bar
                  near the top.
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
                  because it is a <a
                    href="https://en.wikipedia.org/wiki/Self-signed_certificate"
                    target="_blank">self signed certificate</a
                  >. (Don't worry, there's no danger in using a self signed
                  certificate on your own network.) Click <code>Continue</code>.
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
                  You should now be connected to your device and see your shared
                  folders. You can upload files to and download files from this
                  computer.
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
            Make sure your phone/tablet is on the same WiFi as this computer. We
            recommend the <code>Owlfiles</code> app from the
            <code>App Store</code>.
            <br />
            <img src="screens/iOS/1.png" alt="Instruction screenshot." />
          </li>
          <li>
            Open the app and tap <code>Allow</code> to allow the app to
            communicate over your network.
            <br />
            <img src="screens/iOS/2.png" alt="Instruction screenshot." />
          </li>
          <li>
            Tap the
            <code>Connections</code> tab at the bottom, then tap the lightning
            icon in the upper right corner.
            <br />
            <img src="screens/iOS/3.png" alt="Instruction screenshot." />
          </li>
          <li>
            Tap the
            <code>New Connection</code> option from the dropdown.
            <br />
            <img src="screens/iOS/4.png" alt="Instruction screenshot." />
          </li>
          <li>
            Tap the
            <code>WebDAV</code> option from the list.
            <br />
            <img src="screens/iOS/5.png" alt="Instruction screenshot." />
          </li>
          <li>
            Enter the following information:
            <ul>
              <li>
                Host URL:
                <code>https://{host.address}:{info.port}</code>
              </li>
              <li>
                User Name:
                <code>{info.username}</code>
              </li>
              <li>
                Password:
                <code>{info.password}</code>
              </li>
            </ul>
            Click
            <code>Save</code>.
            <br />
            <img src="screens/iOS/6.png" alt="Instruction screenshot." />
          </li>
          <li>
            Click the new entry in the Connections list.
            <br />
            <img src="screens/iOS/7.png" alt="Instruction screenshot." />
          </li>
          <li>
            You'll see a warning about the server's certificate. This is because
            it is a <a
              href="https://en.wikipedia.org/wiki/Self-signed_certificate"
              target="_blank">self signed certificate</a
            >. (Don't worry, there's no danger in using a self signed
            certificate on your own network.) Click
            <code>Trust this server</code>.
            <br />
            <img src="screens/iOS/8.png" alt="Instruction screenshot." />
          </li>
          <li>
            You should now be connected to your device and see your shared
            folders. You can upload files to and download files from this
            computer.
            <br />
            <img src="screens/iOS/9.png" alt="Instruction screenshot." />
          </li>
        </ol>
      </Content>
    </Panel>
    <Panel variant="outlined" color="primary" extend>
      <Header>Android</Header>
      <Content>
        <ol>
          <li>
            Make sure your phone/tablet is on the same WiFi as this computer. We
            recommend the <code>Owlfiles</code> app from the
            <code>Play Store</code>.
            <br />
            <img src="screens/Android/1.png" alt="Instruction screenshot." />
          </li>
          <li>
            Open the app and tap the
            <code>Connections</code> tab at the bottom, then tap the lightning
            icon in the upper right corner.
            <br />
            <img src="screens/Android/2.png" alt="Instruction screenshot." />
          </li>
          <li>
            Tap the
            <code>New Connection</code> option from the dropdown.
            <br />
            <img src="screens/Android/3.png" alt="Instruction screenshot." />
          </li>
          <li>
            Tap the
            <code>WebDAV</code> option from the list.
            <br />
            <img src="screens/Android/4.png" alt="Instruction screenshot." />
          </li>
          <li>
            Enter the following information:
            <ul>
              <li>
                Host URL:
                <code>https://{host.address}:{info.port}</code>
              </li>
              <li>
                User Name:
                <code>{info.username}</code>
              </li>
              <li>
                Password:
                <code>{info.password}</code>
              </li>
            </ul>
            Click the save icon in the upper right corner.
            <br />
            <img src="screens/Android/5.png" alt="Instruction screenshot." />
          </li>
          <li>
            You'll see a warning about the server's certificate. This is because
            it is a <a
              href="https://en.wikipedia.org/wiki/Self-signed_certificate"
              target="_blank">self signed certificate</a
            >. (Don't worry, there's no danger in using a self signed
            certificate on your own network.) Click <code>TRUST</code>.
            <br />
            <img src="screens/Android/6.png" alt="Instruction screenshot." />
          </li>
          <li>
            You should now be connected to your device and see your shared
            folders. You can upload files to and download files from this
            computer.
            <br />
            <img src="screens/Android/7.png" alt="Instruction screenshot." />
          </li>
        </ol>
      </Content>
    </Panel>
    <Panel
      variant="outlined"
      color="primary"
      extend
      bind:open={panelOpenBrowser}
    >
      <Header>Browser (Chrome, Firefox, Safari, etc)</Header>
      <Content>
        <Accordion multiple>
          <Panel variant="outlined" color="secondary" extend>
            <Header tabindex={panelOpenBrowser ? 0 : -1}
              >Chrome and Chromium Browsers (Edge, Brave, Opera, etc)</Header
            >
            <Content>
              <ol>
                <li>
                  Make sure your device is on the same network as this computer.
                  In your device's browser, click on the address bar, and type <code
                    >https://{host.address}:{info.port}/</code
                  >. Hit the enter key.
                  <br />
                  <img
                    src="screens/Browser-Chrome/1.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You will be warned that your connection is not private. This
                  is because it's using a <a
                    href="https://en.wikipedia.org/wiki/Self-signed_certificate"
                    target="_blank">self signed certificate</a
                  >. Your connection is private on your own network. (Don't
                  worry, there's no danger in using a self signed certificate on
                  your own network.) Click <code>Advanced</code>.
                  <br />
                  <img
                    src="screens/Browser-Chrome/2.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  Click <code>Proceed to {host.address} (unsafe)</code>. Again,
                  it's safe as long as you're on your own network.
                  <br />
                  <img
                    src="screens/Browser-Chrome/3.png"
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
                  <code>Sign in</code>.
                  <br />
                  <img
                    src="screens/Browser-Chrome/4.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device and see your shared
                  folders.
                  <br />
                  <img
                    src="screens/Browser-Chrome/5.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You can upload files to and download files from this computer.
                  <br />
                  <img
                    src="screens/Browser-Chrome/6.png"
                    alt="Instruction screenshot."
                  />
                </li>
              </ol>
            </Content>
          </Panel>
          <Panel variant="outlined" color="secondary" extend>
            <Header tabindex={panelOpenBrowser ? 0 : -1}>Firefox</Header>
            <Content>
              <ol>
                <li>
                  Make sure your device is on the same network as this computer.
                  In your device's browser, click on the address bar, and type <code
                    >https://{host.address}:{info.port}/</code
                  >. Hit the enter key.
                  <br />
                  <img
                    src="screens/Browser-Firefox/1.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You will be warned of a potential security risk. This is
                  because it's using a <a
                    href="https://en.wikipedia.org/wiki/Self-signed_certificate"
                    target="_blank">self signed certificate</a
                  >. Your connection is private on your own network. (Don't
                  worry, there's no danger in using a self signed certificate on
                  your own network.) Click <code>Advanced</code>.
                  <br />
                  <img
                    src="screens/Browser-Firefox/2.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  Click <code>Accept the Risk and Continue</code>. Again, it's
                  safe as long as you're on your own network.
                  <br />
                  <img
                    src="screens/Browser-Firefox/3.png"
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
                  <code>Sign in</code>.
                  <br />
                  <img
                    src="screens/Browser-Firefox/4.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device and see your shared
                  folders.
                  <br />
                  <img
                    src="screens/Browser-Firefox/5.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You can upload files to and download files from this computer.
                  <br />
                  <img
                    src="screens/Browser-Firefox/6.png"
                    alt="Instruction screenshot."
                  />
                </li>
              </ol>
            </Content>
          </Panel>
          <Panel variant="outlined" color="secondary" extend>
            <Header tabindex={panelOpenBrowser ? 0 : -1}>Safari</Header>
            <Content>
              <ol>
                <li>
                  Make sure your device is on the same network as this computer.
                  In your device's browser, click on the address bar, and type <code
                    >https://{host.address}:{info.port}/</code
                  >. Hit the enter key.
                  <br />
                  <img
                    src="screens/Browser-Safari/1.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You will be warned that this connection is not private. This
                  is because it's using a <a
                    href="https://en.wikipedia.org/wiki/Self-signed_certificate"
                    target="_blank">self signed certificate</a
                  >. Your connection is private on your own network. (Don't
                  worry, there's no danger in using a self signed certificate on
                  your own network.) Click <code>Show Details</code>.
                  <br />
                  <img
                    src="screens/Browser-Safari/2.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  Click <code>visit this website</code>. Again, it's safe as
                  long as you're on your own network.
                  <br />
                  <img
                    src="screens/Browser-Safari/3.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You'll be asked to confirm you want to continue. Click <code
                    >Visit Website</code
                  >.
                  <br />
                  <img
                    src="screens/Browser-Safari/4.png"
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
                  <code>Sign in</code>.
                  <br />
                  <img
                    src="screens/Browser-Safari/5.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You should now be connected to your device and see your shared
                  folders.
                  <br />
                  <img
                    src="screens/Browser-Safari/6.png"
                    alt="Instruction screenshot."
                  />
                </li>
                <li>
                  You can upload files to and download files from this computer.
                  <br />
                  <img
                    src="screens/Browser-Safari/7.png"
                    alt="Instruction screenshot."
                  />
                </li>
              </ol>
            </Content>
          </Panel>
        </Accordion>
      </Content>
    </Panel>
  </Accordion>
</div>

<h5 style="margin: 1em 0;">Launch Options</h5>

<div style="font-size: smaller; margin-top: 1em;">
  QuickDAV supports the following environment variables and command line
  arguments to set the configuration. Command line arguments take precedence
  over environment variables.

  <ul>
    <li>
      <code>DAV_PORT</code> / <code>--port &lt;port&gt;</code>
      <br />
      The port to listen on.
    </li>
    <li>
      <code>DAV_USERNAME</code> / <code>--username &lt;username&gt;</code>
      <br />
      The authentication username.
    </li>
    <li>
      <code>DAV_PASSWORD</code> / <code>--password &lt;password&gt;</code>
      <br />
      The authentication password.
    </li>
    <li>
      <code>DAV_TLS</code> / <code>--tsl</code> / <code>--no-tls</code>
      <br />
      Whether to use self signed TLS encryption. (DAV_TLS="off" to disable.)
    </li>
    <li>
      <code>DAV_AUTH</code> / <code>--auth</code> / <code>--no-auth</code>
      <br />
      Whether to require a username and password. (DAV_AUTH="off" to disable.)
    </li>
    <li>
      <code>DAV_READONLY</code> / <code>--readonly</code> /
      <code>--no-readonly</code>
      <br />
      Whether file shares should be read only. (DAV_READONLY="on" to enable.)
    </li>
  </ul>
</div>

<div style="font-size: smaller; margin-top: 1em;">
  QuickDAV supports the following environment variables and command line
  arguments to force certain options.

  <ul>
    <li>
      <code>DARK_MODE</code> / <code>--darkmode</code> /
      <code>--no-darkmode</code>
      <br />
      Force dark mode. (DARK_MODE="on" or DARK_MODE="off")
    </li>
    <li>
      <code>GAMEPADUI</code> / <code>--gamepadui</code> /
      <code>--no-gamepadui</code>
      <br />
      Force gamepad UI. Gamepad UI is automatically enabled if QuickDAV is launched
      from Steam. (GAMEPADUI="on" or GAMEPADUI="off")
    </li>
    <li>
      <code>WIDTH</code> / <code>--width &lt;width&gt;</code>
      <br />
      Set the window width.
    </li>
    <li>
      <code>HEIGHT</code> / <code>--height &lt;height&gt;</code>
      <br />
      Set the window height.
    </li>
    <li>
      <code>LOGGING</code> / <code>--logging</code> /
      <code>--no-logging</code>
      <br />
      Enable the activity log. Default is "on". (LOGGING="on" or LOGGING="off")
    </li>
    <li>
      <code>AUTOUPDATE</code> / <code>--autoupdate</code> /
      <code>--no-autoupdate</code>
      <br />
      Check for updates and automatically install them. Default is "on". (AUTOUPDATE="on"
      or AUTOUPDATE="off")
    </li>
  </ul>
</div>

<div style="font-size: smaller; margin-top: 1em;">
  <a href="https://sciactive.com/quickdav/" target="_blank">QuickDAV</a> is
  <a href="https://github.com/sciactive/quickdav" target="_blank"
    >free software</a
  >
  released by
  <a href="https://sciactive.com" target="_blank">SciActive Inc</a> under the Apache
  2.0 open source license.
</div>

<div style="font-size: smaller; margin-top: 1em;">
  You can <a href="https://www.patreon.com/sciactive" target="_blank"
    >support SciActive on Patreon</a
  >.
</div>

<div style="font-size: smaller; margin-top: 1em;">
  Copyright &copy; 2022-2024 SciActive Inc. All Rights Reserved.
</div>

<div style="font-size: smaller; margin-top: 1em;">
  Xbox Series Button Icons and Controls - Zacksly Licensed under CC BY 3.0 -
  <a href="https://zacksly.itch.io" target="_blank">https://zacksly.itch.io</a> (Modified
  by SciActive, Inc)
</div>

<script lang="ts">
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import type { Info } from '../server/preload.js';

  let { info }: { info: Info } = $props();

  const host = $derived(info.hosts[0] || { address: 'device-ip-address' });

  let panelOpenWindows = $state(false);
  let panelOpenLinux = $state(false);
  let panelOpenBrowser = $state(false);
</script>
