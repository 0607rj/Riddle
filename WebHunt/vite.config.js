import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Adjust base if your site is deployed in a subdirectory
export default defineConfig({
  plugins: [react()],
  base: '/riddle/', // This sets the base path for your app when deployed in a subdirectory
  build: {
    outDir: 'dist', // Your build output folder
  },
});
