import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export default defineConfig({
  output: 'server',
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
  },
  adapter: isDev ? undefined : cloudflare()
});