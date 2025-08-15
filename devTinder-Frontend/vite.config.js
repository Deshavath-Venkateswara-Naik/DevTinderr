import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for production deployment
export default defineConfig({
  plugins: [react()],
  // No `server` needed in production
  build: {
    outDir: 'dist', // default output folder for Vercel
  },
});
