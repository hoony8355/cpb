import { Post } from '../types';

const posts: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello World: My First Blog Post',
    author: 'John Doe',
    publishDate: '2023-10-27',
    excerpt: 'This is the beginning of a beautiful blogging journey. Join me as I explore various topics in technology and life.',
    content: `
# Hello World!

Welcome to my new blog! This is the very first post.

Here is a list of things I plan to talk about:
- Web Development
- AI and Machine Learning
- Personal Growth

Stay tuned for more!
    `,
    tags: ['welcome', 'tech', 'general'],
    imageUrl: 'https://via.placeholder.com/800x400',
  },
  {
    slug: 'deep-dive-into-react',
    title: 'A Deep Dive into React Hooks',
    author: 'Jane Smith',
    publishDate: '2023-10-28',
    excerpt: 'React Hooks have changed the way we write components. Let\'s explore useState, useEffect, and custom hooks in detail.',
    content: `
# A Deep Dive into React Hooks

React Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## useState

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

## useEffect

\`\`\`jsx
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]);
\`\`\`
    `,
    tags: ['react', 'javascript', 'frontend'],
    imageUrl: 'https://via.placeholder.com/800x400',
  },
];

export const getPosts = (): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(posts), 500);
  });
};

export const getPostBySlug = (slug: string): Promise<Post | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = posts.find((p) => p.slug === slug);
      resolve(post);
    }, 500);
  });
};

export const getRelatedPosts = (currentPost: Post): Promise<Post[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const related = posts.filter(p => p.slug !== currentPost.slug && p.tags.some(tag => currentPost.tags.includes(tag)));
            resolve(related.slice(0, 3));
        }, 500);
    });
};
