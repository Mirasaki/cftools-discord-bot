import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entryPoints: ['src/index.ts'],
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  minify: false,
  ...options,
}));
