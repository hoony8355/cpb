import { Post } from '../types';

const posts: Post[] = [
  {
    id: 'gemini-api-intro',
    title: 'Getting Started with the Gemini API',
    author: 'Jane Doe',
    date: '2024-07-29',
    excerpt: 'A beginner-friendly guide to using the Google Gemini API for your projects.',
    content: `
# Introduction to Gemini API

The Google Gemini API is a powerful tool for developers aiming to integrate generative AI into their applications. This post will walk you through the initial setup and a basic example.

## Setup

First, you need to get an API key...

## Example

Here is a simple example using Node.js:

\`\`\`javascript
console.log("Hello, Gemini!");
\`\`\`
`,
    tags: ['Gemini', 'API', 'AI'],
  },
  {
    id: 'react-hooks-deep-dive',
    title: 'A Deep Dive into React Hooks',
    author: 'John Smith',
    date: '2024-07-25',
    excerpt: 'Explore advanced concepts and patterns for using React Hooks effectively.',
    content: `
# React Hooks: Beyond the Basics

useState and useEffect are just the beginning. Let's explore custom hooks, useReducer, and more.

## Custom Hooks

Creating your own hooks allows you to extract component logic into reusable functions.
`,
    tags: ['React', 'JavaScript', 'Frontend'],
  },
   {
    id: 'ai-in-frontend',
    title: 'The Role of AI in Modern Frontend Development',
    author: 'Jane Doe',
    date: '2024-07-22',
    excerpt: 'Discover how AI is changing the landscape of frontend development, from code generation to automated testing.',
    content: `
# AI is transforming Frontend

From Github Copilot to AI-powered design tools, the way we build user interfaces is evolving rapidly.
`,
    tags: ['AI', 'Frontend', 'Development'],
  }
];

export const getPosts = async (): Promise<Post[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 200));
  return posts;
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 200));
  return posts.find(post => post.id === id);
};
