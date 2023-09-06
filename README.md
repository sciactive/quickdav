# QuickDAV

Instantly transfer files to your device over your local network.

![QuickDAV Screenshot](https://sciactive.com/wp-content/uploads/2022/09/quickdav-screen-dash-1024x681.png)

QuickDAV is an open source network file transfer utility. It makes it easy to share files between your devices by creating a simple WebDAV server.

# Download

Check out the [releases page](https://github.com/sciactive/quickdav/releases).

# QuickDAV is Open Source!

QuickDAV used to be closed source, but now it's open source! Yay!

# Development

## Build files in dev mode, and watch them.

```sh
env NODE_ENV="development" npm run watch
```

## Start in Dev Mode

```sh
env NODE_ENV="development" npm start
```

## macOS Code Signing

In order to sign the app for macOS App Store, you need to:

- import the developer CSAs (Worldwide Developer Relations, Developer ID) from https://www.apple.com/certificateauthority/
- import "SciActive Inc, Distribution", "SciActive Inc, Mac Installer Distribution", "SciActive Inc, Developer ID Application" from Certificates page in Apple Developer portal
- download QuickDAV profile from Apple Developer portal and place in this directory

# License

Copyright 2022-2023 SciActive Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
