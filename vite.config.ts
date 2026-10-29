import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Kamao/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
});
