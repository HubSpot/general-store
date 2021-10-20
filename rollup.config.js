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
        name: 'GeneralStore',
      },
    ],
    external: ['react'],
  };
  return config;
};
const moduleBundle = format => ({
  input: './src/GeneralStore.ts',
  plugins: [
    typescript({
      target: format === 'esm' ? 'es2015' : 'es5'
    }),
  ],
  output: [
    {
      file: `dist/general-store.esm.js`,
      format
    },
  ],
  external: ['react', 'hoist-non-react-statics'],
});

export default [
  bundle('development'),
  bundle('production'),
  moduleBundle('cjs'),
  moduleBundle('esm'),
];
