#!/bin/sh

npx clangffi --lib-path /usr/lib/libclang.so -L cpp -i $HOME/steamworks_sdk_*/sdk/public/steam/steam_api.h --include-directory $HOME/steamworks_sdk_*/sdk/public/steam/ --include "*" -o ./server/steam_api.ts
