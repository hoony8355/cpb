import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

// Function to get post slugs for sitemap
const getPostRoutes = () => {
  const postsDirectory = join(process.cwd(), 'src/posts');
  try {
    const fileNames = readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return `/post/${slug}`;
    });
  } catch (error) {
    console.warn('Could not read posts directory for sitemap generation.');
    return [];
  }
};


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const postRoutes = getPostRoutes();

  return {
    plugins: [
      react(),
      sitemap({
        hostname: 'https://cpb-five.vercel.app',
        dynamicRoutes: ['/', ...postRoutes],
        robots: [{ userAgent: '*', allow: '/' }],
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
     resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
