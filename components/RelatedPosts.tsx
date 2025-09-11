import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, getPostBySlug } from '../services/postService';
import { Post } from '../types';
import { findRelatedPosts } from '../services/geminiService';

interface RelatedPostsProps {
  currentPostSlug: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostSlug }) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      const allPosts = await getAllPosts();
      const currentPost = await getPostBySlug(currentPostSlug);
      if (currentPost) {
        const aiRelatedPosts = await findRelatedPosts(currentPost, allPosts);
        setRelatedPosts(aiRelatedPosts);
      }
      setLoading(false);
    };
    fetchRelated();
  }, [currentPostSlug]);

  if (loading) {
    return (
        <div className="mt-12">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-6 animate-pulse"></div>
            <div className="space-y-4">
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 글 더보기</h2>
      <div className="space-y-4">
        {relatedPosts.map(post => (
          <Link to={`/post/${post.slug}`} key={post.slug} className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-indigo-700">{post.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
