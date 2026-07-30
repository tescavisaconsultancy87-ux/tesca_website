import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Canonical site URL — used for sitemap/canonical generation.
  site: 'https://tescavisa.com',
  trailingSlash: 'never',
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
      include: ['lucide-react', 'framer-motion', '@supabase/supabase-js', 'react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        external: ['cloudflare:workers']
      }
    }
  }
});