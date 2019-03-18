import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';

const bundle = env => {
  const file =
    env === 'production'
      ? 'dist/general-store.min.js'
      : 'dist/general-store.js';
  const additionalPlugins = [];
  if (env === 'production') {
    additionalPlugins.push(uglify());
  }
  const config = {
    input: './src/GeneralStore.ts',
    plugins: [
      typescript(),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      resolve({
        browser: true,
      }),
      ...additionalPlugins,
    ],
    output: [
      {
        file,
        format: 'umd',
        exports: 'named',
        compact: env === 'production',
        globals: {
          react: 'React',
        },
      },
    ],
    external: ['react'],
  };
  return config;
};
const moduleBundleConfig = {
  input: './src/GeneralStore.ts',
  plugins: [
    typescript(),
    commonjs(),
    resolve({
      browser: true,
    }),
  ],
  output: [
    {
      file: `dist/general-store.cjs.js`,
      format: 'cjs',
    },
    {
      file: `dist/general-store.esm.js`,
      format: 'esm',
    },
  ],
  external: ['react'],
};

export default [
  bundle('development'),
  bundle('production'),
  moduleBundleConfig,
];
