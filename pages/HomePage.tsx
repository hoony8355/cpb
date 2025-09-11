import React, { useState, useEffect } from 'react';
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

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div>
      <SeoManager 
        title="Home"
        description="Welcome to My Awesome Blog where we discuss tech and more."
      />
      <h1>Latest Posts</h1>
      {posts.map(post => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  );
};

export default HomePage;
