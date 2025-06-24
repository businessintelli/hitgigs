import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./"),
    },
  },
  server: {
    host: true,  // Allow external connections
    port: 3002,  // Specific port
    cors: true,  // Enable CORS
    strictPort: true,  // Use exact port
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Backend API
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    host: true,  // Allow external connections for preview
    port: 3002,
    cors: true,
    strictPort: true,
  }
})

