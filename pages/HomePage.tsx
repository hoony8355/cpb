import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { postService } from '../services/postService';
import BlogPostCard from '../components/BlogPostCard';
import SeoManager from '../components/SeoManager';
import usePageTracking from '../hooks/usePageTracking';

const HomePage: React.FC = () => {
  usePageTracking();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postService.getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <SeoManager
        title="My Tech Blog"
        description="A blog about modern web development, AI, and technology."
      />
      <h1 className="text-4xl font-bold mb-8 text-center">Latest Posts</h1>
      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map(post => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
