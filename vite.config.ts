import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Vite does not expose process.env by default
    // This makes process.env.API_KEY available in the client-side code
    // In a production app, use a more secure way to handle API keys.
    'process.env': {
      API_KEY: process.env.VITE_GEMINI_API_KEY
    }
  }
})
