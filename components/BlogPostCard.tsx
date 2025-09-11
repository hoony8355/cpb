import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div style={styles.card}>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={styles.image} />}
      <div style={styles.content}>
        <h2 style={styles.title}><Link to={`/post/${post.slug}`} style={styles.link}>{post.title}</Link></h2>
        <p style={styles.meta}><small>
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by {post.author}
        </small></p>
        <p style={styles.excerpt}>{post.excerpt}</p>
        <Link to={`/post/${post.slug}`} style={styles.readMore}>Read more →</Link>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '2rem',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '1.5rem',
  },
  title: {
      marginTop: 0,
      marginBottom: '0.5rem',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
  },
  meta: {
    color: '#666',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  },
  excerpt: {
    color: '#555',
    lineHeight: '1.6',
  },
  readMore: {
    textDecoration: 'none',
    color: '#0070f3',
    fontWeight: 'bold',
  }
};

export default BlogPostCard;
