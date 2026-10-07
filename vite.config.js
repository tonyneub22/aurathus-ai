import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/config/site.js'

// index.html writes the domain as __SITE_URL__ so it comes from site.js, like all other copy.
const siteUrl = () => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', site.siteUrl),
})

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
  build: {
    // The three.js chunk is ~575 kB raw / ~145 kB gzipped and is lazy-loaded
    // by the hero only, so it never blocks first paint.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // three.js is only needed by the hero; keep it in its own chunk.
        manualChunks: { three: ['three'] },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
