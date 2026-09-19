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
    esbuild: {
      target: 'es2020',
      supported: {
        'logical-assignment': false,
        'class-field': false
      }
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        external: ['cloudflare:workers'],
        output: {
          banner: (chunk) => {
            // Guard: Never inject un-transpiled ??= into client or server bundles.
            // For client chunks (_astro/), do not inject any banner.
            const fileName = chunk?.fileName || '';
            if (fileName.startsWith('_astro/') || fileName.includes('client') || !fileName.includes('server') && !fileName.includes('_worker')) {
              return '';
            }
            // For Cloudflare Workers SSR server bundle, provide safe ES5-compatible shim:
            return "typeof globalThis.process==='undefined'&&(globalThis.process={env:{}});globalThis.process&&!globalThis.process.env&&(globalThis.process.env={});";
          }
        }
      }
    }

  }
});