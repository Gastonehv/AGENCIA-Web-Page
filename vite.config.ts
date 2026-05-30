import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
  },
  build: {
    // Sin manualChunks: Rollup decide el orden de inicialización seguro.
    // El splitting manual causaba que vendor-core (lucide-react) se evaluara
    // después de que vendor-3d ya intentaba consumir sus exports → undefined.
    chunkSizeWarningLimit: 1600,
  }
})
