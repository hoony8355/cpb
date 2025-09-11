import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post, YouTubeVideo } from '../types';
import { getPostBySlug } from '../services/postService';
import { findYouTubeVideo } from '../services/geminiService';
import NotFoundPage from './NotFoundPage';
import SeoManager from '../components/SeoManager';
import Breadcrumbs from '../components/Breadcrumbs';
import YouTubeEmbed from '../components/YouTubeEmbed';
import AuthorBox from '../components/AuthorBox';
import RelatedPosts from '../components/RelatedPosts';

const PostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [video, setVideo] = useState<YouTubeVideo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) {
                setError(true);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const fetchedPost = await getPostBySlug(slug);
                if (fetchedPost) {
                    setPost(fetchedPost);
                    findYouTubeVideo(fetchedPost).then(setVideo);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Failed to fetch post:", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return <div className="text-center p-10">Loading post...</div>;
    }

    if (error || !post) {
        return <NotFoundPage />;
    }

    return (
        <>
            <SeoManager post={post} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <article className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                        <Breadcrumbs postTitle={post.title} />
                        <header className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
                            <p className="text-gray-500 text-sm">
                                Published on {new Date(post.date).toLocaleDateString()} by {post.author.name}
                            </p>
                        </header>
                        
                        {post.coverImage && (
                            <img 
                                src={post.coverImage} 
                                alt={`Cover for ${post.title}`} 
                                className="w-full h-auto rounded-lg my-8"
                                loading="lazy"
                                decoding="async"
                            />
                        )}

                        {video && (
                            <div className="my-8">
                                <YouTubeEmbed embedId={video.id} title={post.title} />
                                <p className="text-sm text-center text-gray-600 mt-2 italic">{video.reason}</p>
                            </div>
                        )}
                        
                        <div className="prose prose-lg max-w-none text-gray-800">
                            {/* This renders content by splitting it into paragraphs. For rich content, a markdown renderer would be better. */}
                            {post.content.split('\n').map((paragraph, index) => {
                                if (paragraph.trim() === '') return <br key={index} />;
                                return <p key={index}>{paragraph}</p>;
                            })}
                        </div>

                        <AuthorBox author={post.author} />
                    </article>

                    <RelatedPosts currentPost={post} />
                </div>
            </div>
        </>
    );
};

export default PostPage;
