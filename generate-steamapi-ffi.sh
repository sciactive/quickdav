#!/bin/sh

npx clangffi --lib-path ~/llvm-project-13.0.0.src/build/lib/libclang -L cpp -i ./steam/steam_api.h --include-directory ./steam/ --include "*" -o ./server/steam_api.ts
