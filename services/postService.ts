import { Post, Author } from '../types';

const authors: { [key: string]: Author } = {
  jane: {
    name: 'Jane Doe',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane',
    bio: 'Jane is a front-end developer and tech enthusiast who loves writing about React, TypeScript, and modern web technologies.',
  },
  john: {
    name: 'John Smith',
    avatarUrl: 'https://i.pravatar.cc/150?u=john',
    bio: 'John is a full-stack engineer with a passion for AI and machine learning. He explores the intersection of technology and creativity.',
  },
};

const posts: Post[] = [
  {
    slug: 'getting-started-with-react-hooks',
    title: 'Getting Started with React Hooks',
    author: authors.jane,
    publishDate: '2023-10-26T10:00:00Z',
    excerpt: 'A comprehensive guide to understanding and using React Hooks for state management and side effects in your functional components.',
    content: `
## What are React Hooks?
Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes.

### The State Hook: useState
\`\`\`jsx
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### The Effect Hook: useEffect
The Effect Hook, \`useEffect\`, adds the ability to perform side effects from a function component. It serves the same purpose as \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\` in React classes, but unified into a single API.
    `,
    tags: ['react', 'javascript', 'frontend'],
    featuredImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1170&q=80',
  },
  {
    slug: 'exploring-the-gemini-api',
    title: 'Exploring the Gemini API for Content Generation',
    author: authors.john,
    publishDate: '2023-11-15T14:30:00Z',
    excerpt: 'Dive into the capabilities of the Google Gemini API and learn how to integrate it into your applications for powerful, AI-driven content generation.',
    content: `
## Introduction to the Gemini API
The Gemini API, provided by Google, is a powerful tool for developers to integrate generative AI models into their applications. It offers a simple yet robust interface to generate text, summarize content, and even create conversational experiences.

### Setting Up
To get started, you'll need an API key from the Google AI Studio. Once you have it, you can install the SDK:
\`\`\`bash
npm install @google/genai
\`\`\`

### Basic Usage
Here's a quick example of how to generate text using the \`gemini-2.5-flash\` model:

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Write a short story about a robot who discovers music.',
  });
  console.log(response.text);
}

run();
\`\`\`

This is just the tip of the iceberg. The API supports streaming, chat, and much more.
    `,
    tags: ['ai', 'gemini-api', 'google'],
    featuredImageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?auto=format&fit=crop&w=1170&q=80',
  }
];

export const postService = {
  getAllPosts: (): Promise<Post[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(posts), 200); // Simulate network delay
    });
  },
  getPostBySlug: (slug: string): Promise<Post | undefined> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(posts.find(p => p.slug === slug)), 200);
    });
  },
};
