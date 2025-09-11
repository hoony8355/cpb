
import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/posts/${post.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleDateString('ko-KR')}</p>
          <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h2>
          <p className="text-gray-600 leading-relaxed">{post.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
