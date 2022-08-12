import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import preprocess from 'svelte-preprocess';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';

const plugins = [
  typescript({ sourceMap: EXPLICIT_DEV }),
  json(),
  nodeResolve(),
  commonjs(),
  ...(EXPLICIT_DEV ? [] : [terser()]),
];

export default [
  {
    input: 'client/main.ts',
    output: {
      file: 'app/client/bundle.js',
      format: 'iife',
      sourcemap: EXPLICIT_DEV,
    },
    plugins: [svelte({ preprocess: preprocess() }), ...plugins],
  },
  {
    input: 'server/main.ts',
    output: {
      file: 'app/server/main.js',
      format: 'cjs',
      sourcemap: EXPLICIT_DEV,
    },
    external: ['electron', 'userid', 'sse4_crc32'],
    plugins,
  },
  {
    input: 'server/preload.ts',
    output: {
      file: 'app/server/preload.js',
      format: 'cjs',
      sourcemap: EXPLICIT_DEV,
    },
    external: ['electron', 'userid', 'sse4_crc32'],
    plugins,
  },
];
