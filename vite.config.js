import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Force port if needed, but usually not.
    watch: {
      usePolling: true // Adding this to help with HMR in some environments
    }
  }
})
