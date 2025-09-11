import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../types';
import { postService } from '../services/postService';
import { markdownParser } from '../services/markdownParser';
import NotFoundPage from './NotFoundPage';
import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import RelatedPosts from '../components/RelatedPosts';
import RelatedContent from '../components/RelatedContent';
import Breadcrumbs from '../components/Breadcrumbs';
import usePageTracking from '../hooks/usePageTracking';

const PostPage: React.FC = () => {
  usePageTracking();
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const fetchedPost = await postService.getPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center">Loading post...</div>;
  }

  if (error || !post) {
    return <NotFoundPage />;
  }

  const postHtml = markdownParser.parse(post.content);

  return (
    <article className="max-w-4xl mx-auto">
      <SeoManager title={post.title} description={post.excerpt} />
      <Breadcrumbs postTitle={post.title} />
      
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">{post.title}</h1>
        <div className="text-gray-500">
          <span>By {post.author.name}</span>
          <span className="mx-2">&bull;</span>
          <span>{new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>
      
      {post.featuredImageUrl && (
          <img src={post.featuredImageUrl} alt={post.title} className="w-full h-auto object-cover rounded-lg mb-8" />
      )}

      {/* Using a typography plugin like Tailwind's @tailwindcss/typography is recommended for styling this block */}
      <div className="prose lg:prose-xl max-w-none mb-12" dangerouslySetInnerHTML={{ __html: postHtml }} />
      
      <div className="space-y-12">
        <AuthorBox author={post.author} />
        <RelatedContent postTitle={post.title} />
        <RelatedPosts currentPostSlug={post.slug} tags={post.tags} />
      </div>
    </article>
  );
};

export default PostPage;
