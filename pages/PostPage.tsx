import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getPostBySlug } from '../services/postService';
import { findYouTubeVideo } from '../services/geminiService';
import { Post, YouTubeVideo } from '../types';
import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import Breadcrumbs from '../components/Breadcrumbs';
import YouTubeEmbed from '../components/YouTubeEmbed';
import RelatedPosts from '../components/RelatedPosts';
import ProductSection from '../components/ProductSection';
import FaqSection from '../components/FaqSection';
import RelatedContent from '../components/RelatedContent';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("No post slug provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setVideo(null); // Reset video on post change

      try {
        const fetchedPost = await getPostBySlug(slug);
        setPost(fetchedPost);

        if (fetchedPost) {
          // Asynchronously fetch YouTube video
          findYouTubeVideo(fetchedPost).then(setVideo);
        }

      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load the post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="mt-4">The post you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <SeoManager
        title={`${post.title} | Trend Spotter`}
        description={post.description}
        keywords={post.keywords.join(', ')}
      />
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs postTitle={post.title} />
          
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(post.date).toLocaleDateString()} by {post.author.name}
            </p>
          </header>

          {post.coverImage && (
            <img 
              src={post.coverImage} 
              alt={`Cover for ${post.title}`} 
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-lg"
            />
          )}

          <div className="prose prose-slate max-w-none lg:prose-lg mb-12">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {video && (
            <div className="my-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">추천 영상</h3>
              <p className="text-sm text-slate-600 mb-4">{video.reason}</p>
              <YouTubeEmbed embedId={video.id} title={post.title} />
            </div>
          )}
          
          {post.products && post.products.length > 0 && (
            <div className="my-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">🏆 추천 상품 Top {post.products.length}</h2>
              {post.products.map((product, index) => (
                <ProductSection key={index} product={product} index={index + 1} />
              ))}
              <RelatedContent productName={post.products[0].name} />
            </div>
          )}

          {post.faq && post.faq.length > 0 && (
            <FaqSection faqItems={post.faq} />
          )}
          
          <AuthorBox author={post.author} />

          <RelatedPosts currentPost={post} />

        </article>
      </div>
    </>
  );
};

export default PostPage;
