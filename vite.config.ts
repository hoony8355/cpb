import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This makes process.env available in client-side code, which is necessary for the Gemini API key.
    // Ensure you have a .env file at the root of your project with VITE_API_KEY=your_key
    // In the code, use import.meta.env.VITE_API_KEY
    // For this exercise, we will assume process.env is polyfilled or handled by the execution environment.
    'process.env': process.env
  }
})
