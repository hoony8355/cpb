import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { getPostBySlug } from '../services/postService';
import { findYouTubeVideo } from '../services/geminiService';
import type { Post, YouTubeVideo } from '../types';

import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedContent from '../components/RelatedContent';
import YouTubeEmbed from '../components/YouTubeEmbed';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | undefined | null>(null);
  const [video, setVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    if (slug) {
      const foundPost = getPostBySlug(slug);
      setPost(foundPost);
      setVideo(null); // Reset video when post changes
      window.scrollTo(0, 0);

      if (foundPost) {
        findYouTubeVideo(foundPost).then(setVideo);
      }
    }
  }, [slug]);

  const productSections = useMemo(() => {
    if (!post) return [];
    return post.content.split('---').map(section => section.trim());
  }, [post]);

  if (post === null) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">404 - Post Not Found</h1>
        <p className="mt-4">Sorry, the post you are looking for does not exist.</p>
      </div>
    );
  }
  
  const breadcrumbs = [
      { name: 'Home', path: '/' },
      { name: post.title, path: `/posts/${post.slug}` }
  ];

  return (
    <>
      <SeoManager
        title={post.title}
        description={post.description}
        keywords={post.keywords.join(', ')}
        schemaJson={post.schemaJson}
        author={post.author}
        postDate={post.date}
        coverImage={post.coverImage}
        breadcrumbs={breadcrumbs}
      />
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />
        <article>
          <header className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{post.title}</h1>
            <p className="text-xl text-slate-600">{post.description}</p>
          </header>

          {video && <YouTubeEmbed embedId={video.videoId} title={post.title} />}

          <img 
              src={post.coverImage} 
              alt={`Cover image for ${post.title}`}
              className="w-full rounded-lg shadow-lg mb-8"
              loading="lazy"
              decoding="async"
          />

          <div className="prose prose-lg max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-800">
            {productSections.map((section, index) => {
              const productTitleMatch = section.match(/###\s*(.*)/);
              const productTitle = productTitleMatch ? productTitleMatch[1] : null;

              return (
                <div key={index}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      img: ({node, ...props}) => {
                        // FIX: Ensure props.src is a string before calling split on it.
                        const src = typeof props.src === 'string'
                            ? props.src.split(',')[0].trim()
                            : props.src;
                        return <img {...props} src={src} className="rounded-lg shadow-md" loading="lazy" decoding="async" />;
                      }
                    }}
                  >
                    {section}
                  </ReactMarkdown>
                  {productTitle && <RelatedContent productTitle={productTitle} />}
                </div>
              );
            })}
          </div>
        </article>
        
        <div className="mt-16 pt-8 border-t">
          <AuthorBox author={post.author} date={post.date} />
        </div>
      </div>
    </>
  );
};

export default PostPage;