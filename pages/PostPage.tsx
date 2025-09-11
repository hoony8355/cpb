import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getPostBySlug, getAllPosts } from '../services/postService';
import { findYouTubeVideo } from '../services/geminiService';
import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedPosts from '../components/RelatedPosts';
import RelatedContent from '../components/RelatedContent';
import YouTubeEmbed from '../components/YouTubeEmbed';
import type { Post, YouTubeVideo, Breadcrumb } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';


const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | undefined | null>(null);
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  useEffect(() => {
    const foundPost = slug ? getPostBySlug(slug) : undefined;
    setPost(foundPost);
    if (foundPost) {
      window.scrollTo(0, 0);
      if (process.env.API_KEY) {
        setIsLoadingVideo(true);
        findYouTubeVideo(foundPost.title, foundPost.description, foundPost.keywords)
          .then(setVideo)
          .finally(() => setIsLoadingVideo(false));
      } else {
        setIsLoadingVideo(false);
      }
    }
  }, [slug]);

  if (post === null) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!post) {
    return <Navigate to="/404" replace />;
  }
  
  const breadcrumbs: Breadcrumb[] = [
    { name: 'Home', path: '/' },
    { name: post.title, path: `/posts/${post.slug}` }
  ];

  // Split content by product sections (---)
  const contentSections = post.content.split('---').map(section => section.trim());
  const productSections = contentSections.filter(section => section.startsWith('###'));

  return (
    <>
      <SeoManager
        title={`${post.title} | Trend Spotter`}
        description={post.description}
        keywords={post.keywords.join(', ')}
        schemaJson={post.schemaJson}
        author={post.author}
        postDate={post.date}
        coverImage={post.coverImage}
        breadcrumbs={breadcrumbs}
      />
      <article className="max-w-4xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{post.title}</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">{post.description}</p>
        </header>
        
        <AuthorBox author={post.author} date={post.date} />

        <figure className="my-8">
            <img 
                src={post.coverImage} 
                alt={`Cover image for ${post.title}`}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                loading="lazy"
            />
        </figure>
        
        {isLoadingVideo ? (
          <div className="text-center my-8">Loading video recommendation...</div>
        ) : (
          video && video.videoId && (
            <div className='my-12 p-6 bg-slate-50 border rounded-lg'>
              <h3 className='text-xl font-bold text-slate-800'>관련 영상 추천</h3>
              <p className='text-slate-600 mb-4'>{video.reason}</p>
              <YouTubeEmbed embedId={video.videoId} title={post.title} />
            </div>
          )
        )}

        <div className="prose prose-slate max-w-none lg:prose-lg prose-img:rounded-xl prose-img:shadow-md">
          {productSections.map((section, index) => {
            const titleMatch = section.match(/^### (.*)/);
            const productTitle = titleMatch ? titleMatch[1] : `Product ${index + 1}`;
            return (
              <div key={index} className="product-section mb-12">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
                  img: ({node, ...props}) => {
                    // FIX: The src prop can be a Blob, which doesn't have a 'split' method. Added a type check.
                    let finalSrc = props.src;
                    if (typeof props.src === 'string') {
                      finalSrc = props.src.split(',')[0].trim();
                    }
                    return <img {...props} src={finalSrc} className="mx-auto" />
                  }
                }}>
                  {section}
                </ReactMarkdown>
                <RelatedContent productTitle={productTitle} />
              </div>
            );
          })}
        </div>
        
        <hr className="my-16 border-slate-200" />
        
        <RelatedPosts currentPost={post} />
        
        <hr className="my-16 border-slate-200" />
        
        <AuthorBox author={post.author} date={post.date} />

      </article>
    </>
  );
};

export default PostPage;