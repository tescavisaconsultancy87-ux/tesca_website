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
      include: [
        'react',
        'react-dom',
        'react-dom/server',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
        'framer-motion',
        'posthog-js',
        'lenis',
        'nodemailer',
        'react-hook-form',
        '@supabase/supabase-js'
      ],
      exclude: ['astro:compiler-runtime', 'astro:virtual-modules/transitions.js']
    },
    ssr: {
      noExternal: ['lucide-react', 'framer-motion'],
      optimizeDeps: {
        exclude: ['astro:compiler-runtime', 'astro:virtual-modules/transitions.js', 'astro:components']
      }
    },
    build: {
      rollupOptions: {
        external: ['cloudflare:workers']
      }
    }
  }
});