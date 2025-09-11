
import React, { useState, useEffect } from 'react';
import { getAllPosts } from '../services/postService';
import type { Post } from '../types';
import BlogPostCard from '../components/BlogPostCard';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getAllPosts());
  }, []);

  return (
    <div className="space-y-12">
      <div className="text-center border-b pb-8">
        <h1 className="text-4xl font-bold text-slate-800">최신 포스트</h1>
        <p className="mt-2 text-lg text-slate-600">최신 상품 추천과 유용한 정보를 확인하세요.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
