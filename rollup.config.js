import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import svelte from 'rollup-plugin-svelte';
import preprocess from 'svelte-preprocess';

const EXPLICIT_DEV = process.env.NODE_ENV === 'development';

const resolvePlugins = (browser) => [
  resolve(
    browser
      ? {
          browser,
          exportConditions: ['default', 'module', 'import', 'svelte'],
          extensions: ['.mjs', '.js', '.json', '.node', '.svelte'],
        }
      : {},
  ),
  commonjs(),
  json(),
];

const plugins = () => [
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
      ...resolvePlugins(true),
      svelte({
        emitCss: false,
        preprocess: preprocess({
          typescript: {
            tsconfigFile: 'tsconfig-svelte.json',
          },
        }),
      }),
      ...plugins(),
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
    plugins: [...resolvePlugins(false), ...plugins()],
  },
  {
    input: 'server/preload.ts',
    output: {
      file: 'app/server/preload.js',
      format: 'cjs',
      sourcemap: EXPLICIT_DEV,
    },
    external: ['electron'],
    plugins: [...resolvePlugins(false), ...plugins()],
  },
];
