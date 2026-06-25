import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Switched from 'server' to 'static' for standard web hosting compatibility
  output: 'static', 
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