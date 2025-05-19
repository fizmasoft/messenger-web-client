import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// Agar kerak bo‘lsa, pluginlar (masalan, React, Vue, Svelte) qo‘shing

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: ['es2015', 'esnext'],
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'iife', 'cjs'],
      name: 'MessengerWebClient',
      fileName: (format) => `messenger-web-client.${format}.js`,
    },
    rollupOptions: {
      // External dependencies qo‘shishingiz mumkin, agar kerak bo‘lsa
    },
  },
  plugins: [dts()],
});
