import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'client/main.ts',
    output: {
      file: 'app/client/bundle.js',
      format: 'iife',
    },
    plugins: [typescript()],
  },
  {
    input: 'server/main.ts',
    output: {
      file: 'app/server/main.js',
      format: 'cjs',
    },
    plugins: [typescript()],
  },
  {
    input: 'server/preload.ts',
    output: {
      file: 'app/server/preload.js',
      format: 'cjs',
    },
    plugins: [typescript()],
  },
];
