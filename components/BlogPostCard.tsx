import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/posts/${post.slug}`} className="group block bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={post.coverImage} alt={post.title} />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{post.description}</p>
        <div className="flex items-center text-sm text-slate-500">
          <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full mr-3" />
          <span>{post.author.name}</span>
          <span className="mx-2">&middot;</span>
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
