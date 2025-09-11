
import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../services/postService';
import { Post } from '../types';
import BlogPostCard from '../components/BlogPostCard';
import SeoManager from '../components/SeoManager';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const fetchedPosts = await getAllPosts();
            setPosts(fetchedPosts);
            setLoading(false);
        };
        fetchPosts();
    }, []);
    
    return (
        <div className="container mx-auto px-4 py-8">
            <SeoManager
              title="Trend Spotter - 최신 트렌드 및 상품 추천"
              description="최신 기술, 제품, 라이프스타일 트렌드를 분석하고 최고의 상품을 추천하는 블로그입니다. 현명한 소비를 위한 가이드를 만나보세요."
            />
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">Trend Spotter</h1>
                <p className="text-lg text-gray-500">당신의 현명한 선택을 위한 최고의 가이드</p>
            </div>
            {loading ? (
                <div className="text-center">로딩 중...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <BlogPostCard key={post.slug} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
