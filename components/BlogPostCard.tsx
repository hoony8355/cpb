import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/posts/${post.slug}`} className="block group bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {post.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-slate-500 mb-2">{new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors flex-grow">{post.title}</h2>
        <p className="text-slate-600 leading-relaxed line-clamp-3 mb-4">{post.description}</p>
        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap gap-2">
          {post.keywords.slice(0, 3).map(keyword => (
            <span key={keyword} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;