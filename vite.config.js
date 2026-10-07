import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
