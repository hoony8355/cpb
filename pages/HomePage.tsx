import React, { useState, useEffect } from 'react';
import { getAllPosts } from '../services/postService';
import type { Post } from '../types';
import BlogPostCard from '../components/BlogPostCard';
import SeoManager from '../components/SeoManager';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getAllPosts());
  }, []);

  const pageTitle = "Trend Spotter - 최신 트렌드 및 리뷰";
  const pageDescription = "최고의 제품을 찾기 위한 당신의 안내서. 정직한 리뷰와 전문가의 인사이트를 통해 최신 트렌드를 확인하세요.";

  return (
    <>
      <SeoManager
        title={pageTitle}
        description={pageDescription}
      />
      <div className="space-y-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Latest Trends & Reviews</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">Your guide to the best products, powered by honest reviews and affiliate insights.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;