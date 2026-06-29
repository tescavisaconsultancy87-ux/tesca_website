import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Canonical site URL — used for sitemap/canonical generation.
  site: 'https://tescavisa.com',
  // Enabled SSR for dynamic API endpoints and runtime database fetching on Cloudflare
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/.wrangler/**', '**/.git/**', '**/node_modules/**']
      }
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      // Add lucide-react to exclude if Vite continues to struggle optimizing it
      exclude: ['audit', 'xray', 'lucide-react'], 
    },
    build: {
      rollupOptions: {
        external: ['cloudflare:workers']
      }
    }
  }
});