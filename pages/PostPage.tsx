import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../services/postService';
import { Post, SeoData } from '../types';
import { parseMarkdown } from '../services/markdownParser';
import AuthorBox from '../components/AuthorBox';
import RelatedPosts from '../components/RelatedPosts';
import Breadcrumbs from '../components/Breadcrumbs';
import SeoManager from '../components/SeoManager';
import { generateSeoData } from '../services/geminiService';
import NotFoundPage from './NotFoundPage';

const PostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null | undefined>(undefined);
    const [seoData, setSeoData] = useState<SeoData | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                setPost(null);
                setLoading(false);
                return;
            };
            setLoading(true);
            const fetchedPost = await getPostById(id);
            setPost(fetchedPost);

            if(fetchedPost) {
                // Generate SEO data using Gemini
                const generatedSeo = await generateSeoData(fetchedPost.content);
                setSeoData(generatedSeo);
            }
            setLoading(false);
        };
        fetchPost();
    }, [id]);

    if (loading || post === undefined) {
        return <div>Loading post...</div>;
    }
    
    if (post === null) {
        return <NotFoundPage />;
    }

    const htmlContent = parseMarkdown(post.content);

    return (
        <div className="post-page">
             <SeoManager
                title={seoData?.title || post.title}
                description={seoData?.description || post.excerpt}
                keywords={seoData?.keywords || post.tags.join(', ')}
            />
            <Breadcrumbs postTitle={post.title} />
            <article>
                <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h1>{post.title}</h1>
                    <p style={{ color: '#666' }}>By {post.author} on {post.date}</p>
                </header>
                <div className="post-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </article>
            <AuthorBox authorName={post.author} />
            <RelatedPosts currentPost={post} />
        </div>
    );
};

export default PostPage;
