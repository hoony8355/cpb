import React, { useEffect, useState } from 'react';
import { Post } from '../types';
import { generateRelatedPosts } from '../services/geminiService';
import { getPosts } from '../services/postService';
import { Link } from 'react-router-dom';

interface RelatedPostsProps {
    currentPost: Post;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost }) => {
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            setLoading(true);
            const allPosts = await getPosts();
            const geminiRelatedPosts = await generateRelatedPosts(currentPost, allPosts);
            setRelatedPosts(geminiRelatedPosts);
            setLoading(false);
        };

        fetchRelated();
    }, [currentPost]);

    if (loading) {
        return <div style={{ marginTop: '2rem' }}>Finding related content...</div>;
    }

    if (relatedPosts.length === 0) {
        return null;
    }

    return (
        <div className="related-posts" style={{ marginTop: '3rem' }}>
            <h2>Related Posts</h2>
            <ul style={{ paddingLeft: '20px' }}>
                {relatedPosts.map(post => (
                    <li key={post.id}>
                        <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RelatedPosts;
