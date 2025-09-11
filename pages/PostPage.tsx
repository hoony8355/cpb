import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';
import type { Post } from '../types';
import SeoManager from '../components/SeoManager';
import AuthorBox from '../components/AuthorBox';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedContent from '../components/RelatedContent';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | undefined | null>(null);

  useEffect(() => {
    if (slug) {
      const foundPost = getPostBySlug(slug);
      setPost(foundPost);
      // Scroll to top when post changes
      window.scrollTo(0, 0);
    }
  }, [slug]);
  
  // A simple markdown to HTML converter to render content.
  const markdownToHtml = (markdown: string) => {
    let html = '';
    const blocks = markdown.split(/\n\s*\n/);
    blocks.forEach(block => {
      if (block.startsWith('### ')) {
        html += `<h3 class="text-2xl font-bold mt-8 mb-4 text-slate-800">${block.substring(4)}</h3>`;
      } else if (block.startsWith('## ')) {
        html += `<h2 class="text-3xl font-bold mt-10 mb-6 text-slate-900 border-b pb-2">${block.substring(3)}</h2>`;
      } else if (block.trim()) {
        html += `<p class="text-lg text-slate-700 leading-relaxed mb-4">${block.replace(/\n/g, '<br/>')}</p>`;
      }
    });
    return html;
  };

  if (post === null) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!post) {
    // A simple 404-like message
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold">404 - Post Not Found</h1>
            <p className="mt-4">Sorry, the post you are looking for does not exist.</p>
        </div>
    );
  }

  return (
    <>
      <SeoManager
        title={post.title}
        description={post.description}
        keywords={post.keywords.join(', ')}
        schemaJson={post.schemaJson}
      />
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs postTitle={post.title} />
        <article>
          <header className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{post.title}</h1>
            <p className="text-xl text-slate-600">{post.description}</p>
            <div className="mt-6">
              <AuthorBox author={post.author} date={post.date} />
            </div>
          </header>

          <img src={post.coverImage} alt={post.title} className="w-full rounded-lg shadow-lg mb-8" />

          <div 
            className="prose prose-lg max-w-none" 
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />
        </article>
        
        <RelatedContent currentPost={post} />
      </div>
    </>
  );
};

export default PostPage;
