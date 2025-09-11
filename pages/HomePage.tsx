import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/postService';
import { Post } from '../types';
import BlogPostCard from '../components/BlogPostCard';
import SeoManager from '../components/SeoManager';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className="home-page">
            <SeoManager
                title="My Awesome Blog"
                description="A blog about tech, AI, and everything in between."
                keywords="blog, tech, ai, gemini, react"
            />
            <h1 style={{ marginBottom: '2rem' }}>Latest Posts</h1>
            {loading ? (
                <div>Loading posts...</div>
            ) : (
                <div className="posts-grid">
                    {posts.map(post => (
                        <BlogPostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
