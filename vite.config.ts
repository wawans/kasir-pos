import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import laravel from 'laravel-vite-plugin'
import { bunny, google } from 'laravel-vite-plugin/fonts'

export default defineConfig({
  plugins: [
    devtools({
      consolePiping: {
        enabled: false,
      },
    }),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './resources/js/routes',
      generatedRouteTree: './resources/js/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
    laravel({
      input: ['resources/js/app.tsx'],
      refresh: true,
      fonts: [
        bunny('Instrument Sans', {
          weights: [400, 500, 600],
        }),
        google('Inter', {
          weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          styles: ['normal', 'italic'],
        }),
        google('Manrope', {
          weights: [200, 300, 400, 500, 600, 700, 800],
          display: 'swap',
        }),
      ],
    }),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // minSize: 100000, // 100KB minimum chunk size
          // maxSize: 500000, // 500KB max chunk size
          groups: [
            {
              name(moduleId) {
                if (moduleId.includes('components/ui')) {
                  return 'components-ui';
                }
                return null;
              },
            },
          ],
        },
      },
    },
  },
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/vendor/**',
        '**/storage/**',
        '**/database/**',
        '**/app/**',
      ],
    },
  },
})
