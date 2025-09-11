
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://cpb-five.vercel.app',
      dynamicRoutes: [], // Posts are discovered via glob, no need to list them here
    }),
  ],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
