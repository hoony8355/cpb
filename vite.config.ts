// FIX: Add a triple-slash directive to include Node.js types. This resolves the TypeScript error for `process.cwd()`.
/// <reference types="node" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' makes all environment variables available, not just VITE_ prefixed ones.
  const env = loadEnv(mode, process.cwd(), '');

  // Since this is an ES module, __dirname is not available directly.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Dynamically generate routes for the sitemap from the posts directory.
  const postDir = path.resolve(__dirname, 'posts');
  const postFiles = fs.readdirSync(postDir);
  const dynamicRoutes = postFiles.map(file => `/post/${path.basename(file, '.md')}`);

  return {
    plugins: [
      react(),
      sitemap({
        hostname: 'https://cpb-five.vercel.app',
        dynamicRoutes,
        // FIX: Explicitly disable robots.txt generation to prevent conflicts with the
        // static file in the `public` directory. This is the definitive fix for the build error.
        generateRobotsTxt: false,
      }),
    ],
    define: {
      // Expose environment variables to the client-side code.
      // This makes `process.env.API_KEY` available in the app.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  };
});