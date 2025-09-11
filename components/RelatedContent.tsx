import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { findRelatedPosts } from '../services/geminiService';
import { getAllPosts } from '../services/postService';
import type { Post } from '../types';

interface RelatedPostSuggestion {
  slug: string;
  title: string;
  reason: string;
}

interface RelatedContentProps {
  currentPost: Post;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ currentPost }) => {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPostSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelated = async () => {
      // The API key must be available for this feature to work.
      if (!process.env.API_KEY) {
        setError("Related content is unavailable because the API key is not configured.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const allPosts = getAllPosts();
        const suggestions = await findRelatedPosts(currentPost, allPosts);
        setRelatedPosts(suggestions);
      } catch (e) {
        console.error("Failed to fetch related content:", e);
        setError("Could not load related content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [currentPost]);

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Finding related posts...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-full mt-2"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6 mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    // Silently fail or show a subtle message instead of a big red box
    console.warn(error);
    return null;
  }

  if (relatedPosts.length === 0) {
    return null; // Don't render the section if there are no related posts
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">You might also like...</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <Link key={post.slug} to={`/posts/${post.slug}`} className="block group bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{post.reason}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedContent;
