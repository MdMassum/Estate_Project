import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      "/api":{
        target: 'https://estate-backend-blond.vercel.app',
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist'  // Vite's build output directory
  },
})
