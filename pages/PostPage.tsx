import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getPostBySlug } from '../services/postService';
import { Post, YouTubeVideo } from '../types';
import { findYouTubeVideo, generateRelatedContentIdeas } from '../services/geminiService';

import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import RelatedPosts from '../components/RelatedPosts';
import RelatedContent from '../components/RelatedContent';
import YouTubeEmbed from '../components/YouTubeEmbed';
import Breadcrumbs from '../components/Breadcrumbs';
import NotFoundPage from './NotFoundPage';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>();
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [productSections, setProductSections] = useState<string[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setPost(undefined);
      const fetchedPost = await getPostBySlug(slug);
      setPost(fetchedPost);

      if (fetchedPost) {
        const sections = fetchedPost.content.split('---').map(s => s.trim()).filter(Boolean);
        setProductSections(sections);
        
        findYouTubeVideo(fetchedPost.title, fetchedPost.description, fetchedPost.keywords).then(setVideo);
      }
    };
    fetchPost();
  }, [slug]);

  if (post === undefined) {
    return <div className="text-center py-20">Loading...</div>;
  }
  if (post === null) {
    return <NotFoundPage />;
  }
  
  const customImageRenderer = (props: any) => {
    const { src, ...rest } = props;
    const firstSrc = typeof src === 'string' ? src.split(',')[0].trim() : src;
    return <img src={firstSrc} {...rest} />;
  };

  return (
    <>
      <SeoManager
        post={post}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
         <Breadcrumbs postTitle={post.title} />
        <article className="prose lg:prose-xl max-w-none bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 !mb-4">{post.title}</h1>
            <div className="text-sm text-gray-500">
              <span>By {post.author.name}</span> | <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
            </div>
            {post.keywords && post.keywords.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {post.keywords.map(keyword => (
                      <span key={keyword} className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          #{keyword}
                      </span>
                  ))}
              </div>
            )}
          </header>
          
          {video && (
             <div className="my-8">
                <h2 className="text-2xl font-bold mb-4">관련 영상 추천</h2>
                <YouTubeEmbed videoId={video.id} />
                <p className="text-sm text-gray-600 mt-2 italic">"{video.reason}"</p>
             </div>
          )}

          {productSections.map((section, index) => {
              const productNameMatch = section.match(/###\s*(.*?)\n/);
              const productName = productNameMatch ? productNameMatch[1] : `section-${index}`;
              return (
                <div key={index} className="product-section mb-8 border-t pt-8">
                    <ReactMarkdown
                        children={section}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{ img: customImageRenderer }}
                    />
                    <RelatedContent productName={productName} />
                </div>
              )
          })}
        </article>

        <AuthorBox author={post.author} />
        <RelatedPosts currentPostSlug={post.slug} />
      </div>
    </>
  );
};

export default PostPage;
