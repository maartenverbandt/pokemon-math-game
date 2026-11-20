import { fileURLToPath, URL } from 'node:url';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    {
      name: 'jsx-in-js',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/src\/.*\.js$/.test(id)) return;
        return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'transform' });
      },
    },
    react({ jsxRuntime: 'classic' }),
  ],
  resolve: {
    alias: {
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      themes: fileURLToPath(new URL('./src/themes.js', import.meta.url)),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
