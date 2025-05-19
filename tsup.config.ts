import { defineConfig } from 'tsup';

export default defineConfig({
  // target: ['es2015', 'esnext'],
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  treeshake: true,
  clean: true,
});
