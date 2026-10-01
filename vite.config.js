import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The Node backend (../Backend) listens on :4000. In dev, "/api" and "/uploads" are proxied to it.
const backend = 'http://localhost:4000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backend,
      '/uploads': backend,
    },
  },
  preview: {
    proxy: {
      '/api': backend,
      '/uploads': backend,
    },
  },
})
