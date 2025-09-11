
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getPostBySlug } from '../services/postService';
import type { Post } from '../types';

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
    <article>
      <header className="mb-8 border-b pb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
        <p className="text-gray-500">{new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.keywords.map(keyword => (
            <span key={keyword} className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {keyword}
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
  );
};

export default PostPage;
