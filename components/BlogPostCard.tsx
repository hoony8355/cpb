import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%', borderRadius: '4px' }} />}
      <h2>
        <Link to={`/post/${post.slug}`} style={{ textDecoration: 'none', color: '#007bff' }}>
          {post.title}
        </Link>
      </h2>
      <p style={{ color: '#666' }}>By {post.author} on {new Date(post.publishDate).toLocaleDateString()}</p>
      <p>{post.excerpt}</p>
      <div>
        {post.tags.map(tag => (
          <span key={tag} style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px', marginRight: '8px', fontSize: '12px' }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogPostCard;
