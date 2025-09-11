import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      sitemap({
        hostname: 'https://cpb-five.vercel.app/',
        dynamicRoutes: ['/'],
        robots: [{ userAgent: '*', allow: '/' }],
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
