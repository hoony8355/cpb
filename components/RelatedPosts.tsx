import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../services/postService';
import { findRelatedPosts } from '../services/geminiService';
import type { Post } from '../types';

interface RelatedPostsProps {
  currentPost: Post;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost }) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const allPosts = getAllPosts().filter(p => p.slug !== currentPost.slug);
    
    findRelatedPosts(currentPost, allPosts)
      .then(recommendedSlugs => {
        const posts = recommendedSlugs
          .map(slug => allPosts.find(p => p.slug === slug))
          .filter((p): p is Post => !!p);
        setRelatedPosts(posts);
      })
      .finally(() => setIsLoading(false));

  }, [currentPost]);

  if (isLoading) {
    return <div>Loading related posts...</div>;
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-3xl font-bold text-slate-800 mb-8 text-center">함께 읽어보면 좋은 글</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedPosts.map(post => (
          <Link key={post.slug} to={`/posts/${post.slug}`} className="group block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-200">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-40 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-5">
              <h4 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors truncate">{post.title}</h4>
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{post.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
