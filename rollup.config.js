import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import preprocess from 'svelte-preprocess';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';

const resolvePlugins = [
  nodeResolve({
    mainFields: ['svelte', 'module', 'main'],
  }),
  commonjs(),
  json(),
];

const plugins = [
  typescript({ sourceMap: EXPLICIT_DEV }),
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
    plugins: [
      ...resolvePlugins,
      svelte({
        emitCss: false,
        preprocess: preprocess({
          typescript: {
            tsconfigFile: 'tsconfig-svelte.json',
          },
        }),
      }),
      ...plugins,
    ],
  },
  {
    input: 'server/main.ts',
    output: {
      file: 'app/server/main.js',
      format: 'cjs',
      sourcemap: EXPLICIT_DEV,
    },
    external: ['electron'],
    plugins: [...resolvePlugins, ...plugins],
  },
  {
    input: 'server/preload.ts',
    output: {
      file: 'app/server/preload.js',
      format: 'cjs',
      sourcemap: EXPLICIT_DEV,
    },
    external: ['electron'],
    plugins: [...resolvePlugins, ...plugins],
  },
];
