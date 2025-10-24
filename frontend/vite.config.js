import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'

// THIS IS THE FIXED CONFIG
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  // ADD THIS ENTIRE 'server' BLOCK
  server: {
    // This allows all origins, which is fine for local development
    cors: true, 
    
    // This is needed for Hot Module Replacement (HMR) to work
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
    // This prevents Vite from clearing the console
    clearScreen: false,
  }
})