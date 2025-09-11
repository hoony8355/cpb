
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';
import { Post, YouTubeVideo } from '../types';
import SeoManager from '../components/SeoManager';
import NotFoundPage from './NotFoundPage';
import AuthorBox from '../components/AuthorBox';
import Breadcrumbs from '../components/Breadcrumbs';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { findYouTubeVideo } from '../services/geminiService';
import RelatedContent from '../components/RelatedContent';
import RelatedPosts from '../components/RelatedPosts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const PostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [video, setVideo] = useState<YouTubeVideo | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) {
                setLoading(false);
                return;
            };
            setLoading(true);
            const fetchedPost = await getPostBySlug(slug);
            setPost(fetchedPost);

            if (fetchedPost) {
                findYouTubeVideo(fetchedPost).then(setVideo);
            }
            setLoading(false);
        };
        fetchPost();
    }, [slug]);

    const productSections = useMemo(() => {
        if (!post) return [];
        return post.content.split('---').map(section => section.trim()).filter(Boolean);
    }, [post]);

    if (loading) {
        return <div className="text-center p-10">포스트를 불러오는 중...</div>;
    }
    
    if (!post) {
        return <NotFoundPage />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <SeoManager
                post={post}
            />
            <Breadcrumbs postTitle={post.title} />
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
                <header className="mb-8 text-center border-b pb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
                    <div className="text-sm text-gray-500">
                        <span>작성자: {post.author.name}</span> | <span>게시일: {new Date(post.date).toLocaleDateString()}</span>
                    </div>
                     <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {post.keywords.map(keyword => (
                            <span key={keyword} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">#{keyword}</span>
                        ))}
                    </div>
                </header>

                {video && (
                    <div className="my-8">
                         <h2 className="text-2xl font-bold mb-4 text-gray-800">관련 영상 추천</h2>
                         <YouTubeEmbed embedId={video.id} title={post.title} />
                         <p className="text-sm text-gray-500 mt-2 italic">AI 추천 이유: {video.reason}</p>
                    </div>
                )}
                
                <div className="prose max-w-none">
                    <img 
                        src={post.coverImage || 'https://source.unsplash.com/random/800x400?sig=' + post.slug}
                        alt={`Cover image for ${post.title}`}
                        className="w-full h-auto rounded-lg mb-8"
                        loading="lazy"
                    />

                    {productSections.map((section, index) => {
                         const productNameMatch = section.match(/### (.*)/);
                         const productName = productNameMatch ? productNameMatch[1] : null;

                        return (
                            <div key={index} className="mb-10 product-section">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        img: ({node, ...props}) => {
                                            const src = typeof props.src === 'string' ? props.src.split(',')[0].trim() : '';
                                            return <img {...props} src={src} className="mx-auto" />
                                        }
                                    }}
                                >
                                    {section}
                                </ReactMarkdown>
                                {productName && index > 0 && ( // index > 0 to skip the intro section
                                    <RelatedContent productName={productName} />
                                )}
                            </div>
                        )
                    })}
                </div>
                
                <AuthorBox author={post.author} />
                <RelatedPosts currentPost={post} />
            </div>
        </div>
    );
};

export default PostPage;
