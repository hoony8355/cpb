import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { postService } from '../services/postService';
import { Link } from 'react-router-dom';

interface RelatedPostsProps {
  tags: string[];
  currentPostSlug: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ tags, currentPostSlug }) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const findRelatedPosts = async () => {
      const allPosts = await postService.getAllPosts();
      const related = allPosts.filter(post => 
        post.slug !== currentPostSlug && 
        post.tags.some(tag => tags.includes(tag))
      ).slice(0, 2); // Show up to 2 related posts
      setRelatedPosts(related);
    };
    
    findRelatedPosts();
  }, [tags, currentPostSlug]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {relatedPosts.map(post => (
          <Link key={post.slug} to={`/post/${post.slug}`} className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-bold text-lg mb-1">{post.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
