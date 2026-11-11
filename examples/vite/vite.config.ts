import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    // Two pages: the full demo, and one that imports only the root entry (used to verify bundle isolation).
    rollupOptions: { input: { main: 'index.html', 'root-only': 'root-only.html' } },
  },
});
