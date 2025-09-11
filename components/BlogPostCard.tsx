import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link to={`/posts/${post.slug}`} className="group flex flex-col bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden border border-slate-200">
      <div className="relative">
        <img 
          className="w-full h-48 object-cover" 
          src={post.coverImage} 
          alt={`Cover image for ${post.title}`}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">{post.description}</p>
        <div className="flex items-center text-sm text-slate-500 mt-auto pt-4 border-t border-slate-100">
          <img 
            src={post.author.image} 
            alt={post.author.name} 
            className="w-8 h-8 rounded-full mr-3 object-cover"
            loading="lazy"
            decoding="async"
          />
          <span>{post.author.name}</span>
          <span className="mx-2">&middot;</span>
          <time dateTime={post.date}>{formattedDate}</time>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
