
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
      external: ['firebase-admin', 'firebase-admin/app', 'firebase-admin/firestore']
    },
  },
  server: {
    port: 3000,
  }
});
