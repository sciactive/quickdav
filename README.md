# Quick DAV

Instantly transfer files to your device over your local network.

# Build openkeyboard

This file is needed for opening the on screen keyboad from the app. You must copy the steam header files to `steam` in the root directory of the repo. You must also copy `libsteam_api.so` into the root directory.

```sh
gcc -o openkeyboard ./openkeyboard.cpp -l steam_api -L .  -Wl,-rpath=./
```

# License

This code is not licensed for use outside of SciActive Inc.
