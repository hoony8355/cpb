import React, { useEffect, useState, Suspense } from 'react';
import { getAllPosts } from '../services/postService';
import { Post } from '../types';
import SeoManager from '../components/SeoManager';

const BlogPostCard = React.lazy(() => import('../components/BlogPostCard'));

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <SeoManager
        title="Trend Spotter - 최신 트렌드와 추천"
        description="최신 기술, 제품, 라이프스타일 트렌드를 분석하고 최고의 제품을 추천합니다. 현명한 소비를 위한 가이드를 만나보세요."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Trend Spotter</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">당신의 현명한 선택을 위한 최신 트렌드와 추천.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<div>Loading cards...</div>}>
            {posts.map(post => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default HomePage;
