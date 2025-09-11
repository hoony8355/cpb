import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getPostBySlug } from '../services/postService';
import type { Post } from '../types';
import SeoManager from '../components/SeoManager';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (slug) {
      setPost(getPostBySlug(slug) ?? null);
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold">포스트를 찾을 수 없습니다.</h2>
            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">홈으로 돌아가기</Link>
        </div>
    );
  }

  return (
    <>
      <SeoManager 
        title={`${post.title} | Trend Spotter`}
        description={post.description}
        keywords={post.keywords}
        imageUrl={post.coverImage}
        post={post}
      />
      <article className="bg-white p-6 sm:p-8 lg:p-12 rounded-2xl shadow-lg">
        <header className="mb-8 text-center border-b border-slate-200 pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{post.title}</h1>
          <p className="text-slate-500">{new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {post.keywords.map(keyword => (
              <span key={keyword} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                #{keyword.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none prose-img:rounded-xl prose-img:mx-auto prose-a:text-blue-600 hover:prose-a:text-blue-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
};

export default PostPage;