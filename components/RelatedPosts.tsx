import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/postService';
import { Post } from '../types';

interface RelatedPostsProps {
  currentPostSlug: string;
  tags: string[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostSlug, tags }) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(allPosts => {
      const related = allPosts.filter(post =>
        post.slug !== currentPostSlug && post.tags.some(tag => tags.includes(tag))
      ).slice(0, 3); // Get up to 3 related posts
      setRelatedPosts(related);
    });
  }, [currentPostSlug, tags]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Related Posts</h3>
      <ul style={styles.list}>
        {relatedPosts.map(post => (
          <li key={post.slug} style={styles.listItem}>
            <Link to={`/post/${post.slug}`} style={styles.link}>{post.title}</Link>
            <p style={styles.excerpt}>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: '3rem',
  },
  title: {
    borderBottom: '2px solid #0070f3',
    paddingBottom: '0.5rem',
    marginBottom: '1.5rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  excerpt: {
    margin: '0.5rem 0 0 0',
    color: '#666',
    fontSize: '0.9rem',
  }
};

export default RelatedPosts;
