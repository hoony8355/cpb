import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/postService';
import { Post } from '../types';
import BlogPostCard from '../components/BlogPostCard';
import SeoManager from '../components/SeoManager';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then(fetchedPosts => {
      setPosts(fetchedPosts);
      setLoading(false);
    });
  }, []);

  return (
    <div style={styles.container}>
      <SeoManager 
        title="AI Tech Blog - Home" 
        description="Welcome to the AI Tech Blog, your source for the latest in AI and web development." 
      />
      <header style={styles.header}>
        <h1 style={styles.title}>Latest Posts</h1>
      </header>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 1rem',
    },
    header: {
        textAlign: 'center',
        margin: '2rem 0',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
    }
};

export default HomePage;
