import React, { useState, useEffect } from 'react';
import { getRelatedPosts } from '../services/postService';
import { Post } from '../types';
import { Link } from 'react-router-dom';

interface RelatedPostsProps {
    currentPost: Post;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    
    useEffect(() => {
        getRelatedPosts(currentPost).then(setPosts);
    }, [currentPost]);

    if (posts.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: '32px' }}>
            <h3>Related Posts</h3>
            {posts.map(post => (
                <div key={post.slug} style={{ marginBottom: '16px', borderLeft: '3px solid #007bff', paddingLeft: '12px' }}>
                    <h4>
                        <Link to={`/post/${post.slug}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                            {post.title}
                        </Link>
                    </h4>
                    <p style={{ margin: '4px 0 0 0' }}>{post.excerpt}</p>
                </div>
            ))}
        </div>
    );
};

export default RelatedPosts;
