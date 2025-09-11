
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { getAllPosts } from '../services/postService';
import { findRelatedPosts } from '../services/geminiService';

interface RelatedPostsProps {
  currentPost: Post;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost }) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      const allPosts = await getAllPosts();
      const related = await findRelatedPosts(currentPost, allPosts);
      setRelatedPosts(related);
      setLoading(false);
    };

    fetchRelated();
  }, [currentPost]);

  if (loading) {
    return <div className="mt-12 text-center text-gray-500">관련 글을 찾는 중...</div>;
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">관련 글</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <Link key={post.slug} to={`/post/${post.slug}`} className="block group">
            <img 
              src={post.coverImage || 'https://source.unsplash.com/random/300x200?sig=' + post.slug} 
              alt={post.title}
              className="w-full h-32 object-cover rounded-lg mb-2"
              loading="lazy"
            />
            <h4 className="font-semibold text-gray-700 group-hover:text-sky-600">{post.title}</h4>
            <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
