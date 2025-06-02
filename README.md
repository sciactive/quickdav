# QuickDAV

Transfer files between devices.

![QuickDAV Screenshot](https://sciactive.com/wp-content/uploads/2022/09/quickdav-screen-dash-1024x681.png)

QuickDAV is an open source network file transfer utility. It makes it easy to share files between your devices by creating a simple, temporary WebDAV server.

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

## macOS Code Signing and Notarization

In order to sign the app for macOS App Store, you need to:

- import the developer CSAs (Worldwide Developer Relations, Developer ID) from https://www.apple.com/certificateauthority/
- import "Developer ID Application:" from Certificates page in Apple Developer portal
- download QuickDAV-Distribute profile from Apple Developer portal and place in this directory
- create `.env` file with `APPLEID` and `APPLEIDPASS` (an app specific password from https://appleid.apple.com/account/manage) and `TEAMID` (from https://developer.apple.com/account#MembershipDetailsCard).

To verify the app was notarized correctly:

- `spctl --assess -vv --type install dist/mac-universal/QuickDAV.app`

# License

Copyright 2022-2025 SciActive Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
