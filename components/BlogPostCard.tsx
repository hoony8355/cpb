import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/post/${post.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="aspect-w-16 aspect-h-9">
          {post.coverImage ? (
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-48 object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">{post.title}</h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.description}</p>
          <div className="flex items-center text-xs text-gray-500">
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
          </div>
           {post.keywords && post.keywords.length > 0 && (
             <div className="mt-4 flex flex-wrap gap-2">
                {post.keywords.slice(0, 3).map(keyword => (
                    <span key={keyword} className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {keyword}
                    </span>
                ))}
             </div>
           )}
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
