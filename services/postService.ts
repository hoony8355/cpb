import { Post } from '../types';

const posts: Post[] = [
  {
    slug: 'getting-started-with-gemini-api',
    title: 'Getting Started with the Gemini API',
    author: 'Jane Smith',
    date: '2024-05-20',
    excerpt: 'A comprehensive guide to setting up and making your first call to the Google Gemini API for generative AI tasks.',
    content: `## Introduction to Gemini

The Google Gemini API provides powerful models for a wide variety of generative AI applications. This post will walk you through the initial setup.

### Prerequisites
- A Google Cloud project
- An API Key for the Gemini API

### Making a Request
Here's a simple example of how to generate text content using the Gemini API with TypeScript:
\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Write a story about a magic backpack.',
  });
  console.log(response.text);
}

run();
\`\`\`
`,
    tags: ['gemini', 'ai', 'typescript', 'google'],
    imageUrl: 'https://via.placeholder.com/800x400'
  },
  {
    slug: 'react-hooks-for-beginners',
    title: 'React Hooks for Beginners',
    author: 'John Doe',
    date: '2024-05-18',
    excerpt: 'Learn the basics of React Hooks, including useState and useEffect, to manage state and side effects in your functional components.',
    content: `## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. Hooks don't work inside classes.

### useState
The \`useState\` hook is a way to add state to functional components.
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect
The \`useEffect\` hook lets you perform side effects in functional components. Data fetching, setting up a subscription, and manually changing the DOM are all examples of side effects.
\`\`\`jsx
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
});
\`\`\`
`,
    tags: ['react', 'javascript', 'hooks', 'webdev'],
    imageUrl: 'https://via.placeholder.com/800x400'
  }
];

export const getPosts = (): Promise<Post[]> => {
  return Promise.resolve(posts);
};

export const getPostBySlug = (slug: string): Promise<Post | undefined> => {
  return Promise.resolve(posts.find(post => post.slug === slug));
};
