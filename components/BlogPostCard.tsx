import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface BlogPostCardProps {
    post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
    return (
        <div className="blog-post-card" style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
            <h2>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>By {post.author} on {post.date}</p>
            <p>{post.excerpt}</p>
            <Link to={`/post/${post.id}`} className="read-more">Read More &rarr;</Link>
        </div>
    );
};

export default BlogPostCard;
