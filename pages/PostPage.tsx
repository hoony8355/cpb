import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';
import { Post, YouTubeVideo } from '../types';
import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import NotFoundPage from './NotFoundPage';
import Breadcrumbs from '../components/Breadcrumbs';
import YouTubeEmbed from '../components/YouTubeEmbed';
import RelatedPosts from '../components/RelatedPosts';
import { findYouTubeVideo } from '../services/geminiService';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setPost(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const fetchedPost = await getPostBySlug(slug);
        setPost(fetchedPost);
        if (fetchedPost) {
          findYouTubeVideo(fetchedPost).then(setVideo);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center p-10">Loading post...</div>;
  }

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SeoManager post={post} />
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs postTitle={post.title} />
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
            <p className="text-gray-500 text-sm">
              Posted on {new Date(post.date).toLocaleDateString()} by {post.author.name}
            </p>
          </header>
          
          {post.coverImage && (
              <img 
                  src={post.coverImage} 
                  alt={`Cover for ${post.title}`} 
                  className="w-full h-auto rounded-lg mb-8"
                  loading="lazy"
                  decoding="async"
              />
          )}

          {/* 
            This renders the post content as HTML. It's assumed that the markdown
            from .md files is converted to HTML during a build process.
            The `prose` class from Tailwind's typography plugin styles the output.
          */}
          <div className="prose lg:prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          {video && (
            <div className="my-8 bg-gray-100 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">추천 영상</h3>
              <p className="text-gray-600 mb-4">{video.reason}</p>
              <YouTubeEmbed embedId={video.id} title={post.title} />
            </div>
          )}

          <AuthorBox author={post.author} />
        </article>
        
        <div className="max-w-5xl mx-auto">
          <RelatedPosts currentPost={post} />
        </div>
      </div>
    </>
  );
};

export default PostPage;
