import { defineConfig } from 'vite';

export default defineConfig({
  // Static, dependency-free site — the source tree is the app.
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    reportCompressedSize: true
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Allows the proxied preview host (e.g. *.e2b.app) to load the dev server
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: true
  }
});
