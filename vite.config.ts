import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import { readdirSync, readFileSync } from 'fs';
import { parse } from 'path';
import matter from 'gray-matter';

const getPostSlugs = () => {
  const postFiles = readdirSync('./posts');
  return postFiles.map(file => {
    const fileContents = readFileSync(`./posts/${file}`, 'utf8');
    const { data } = matter(fileContents);
    return {
      slug: parse(file).name,
      lastmod: data.date,
    };
  });
};

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://cpb-five.vercel.app/',
      // Fix: Use `routes` instead of `dynamicRoutes` and `path` instead of `route` to match the sitemap plugin's API.
      routes: getPostSlugs().map(post => ({
        path: `/post/${post.slug}`,
        lastmod: post.lastmod,
      })),
      robots: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    }),
  ],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  },
});