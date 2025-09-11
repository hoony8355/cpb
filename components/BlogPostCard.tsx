import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/post/${post.slug}`} className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
      {post.featuredImageUrl && (
        <img src={post.featuredImageUrl} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.excerpt}</p>
        <div className="text-sm text-gray-500">
          <span>{post.author.name}</span>
          <span className="mx-2">&bull;</span>
          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
