import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  base: '/',
  root: '.',

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        gallary: './frontend/html/gallary.html',
        editor: './frontend/html/editor.html'
      }
    }
  },

  server: {
    port: 3000,
    open: true, // Automatically open the browser on start
  },

  plugins: [
    inject({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  optimizeDeps: {
    include: ['jquery'],
  },

  resolve: {
    alias: [
      { find: '@', replacement: '/frontend/src' },
    ],
  },
});
