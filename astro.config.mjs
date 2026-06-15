import { defineConfig, sessionDrivers } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  integrations: [react()],
  session: {
    driver: sessionDrivers.lruCache({
      max: 100
    })
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      exclude: ['audit', 'xray'],
    },
  },
  adapter: cloudflare()
});