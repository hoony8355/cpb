
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/post/${post.slug}`} className="block group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={post.coverImage || 'https://source.unsplash.com/random/400x250?sig=' + post.slug} 
          alt={`Cover image for ${post.title}`}
          className="w-full h-48 object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors duration-300">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-3">{new Date(post.date).toLocaleDateString()}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.keywords.slice(0, 3).map(keyword => (
            <span key={keyword} className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">{keyword}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
