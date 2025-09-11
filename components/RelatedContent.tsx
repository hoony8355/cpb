import React, { useState, useEffect } from 'react';
import { generateRelatedContent } from '../services/geminiService';
import { Post, RelatedItem } from '../types';

interface RelatedContentProps {
    post: Post;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ post }) => {
    const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                setLoading(true);
                setError(null);
                const items = await generateRelatedContent(post.title, post.content);
                setRelatedItems(items);
            } catch (err) {
                setError('Failed to load AI-powered related content.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [post]);

    if (loading) return <div>Loading related content...</div>;
    if (error) return <div>{error}</div>;
    if (!relatedItems || relatedItems.length === 0) return null;

    return (
        <div style={{ marginTop: '32px', padding: '16px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3>AI-Generated Related Content</h3>
            <ul>
                {relatedItems.map((item, index) => (
                    <li key={index}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RelatedContent;
