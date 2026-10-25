import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // On your PC, send any request starting with /api to the .NET backend.
      // (On the server, Nginx does this job instead.)
      '/api': 'http://localhost:5017',
    },
  },
})