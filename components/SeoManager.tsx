import React, { useEffect } from 'react';
import { Post } from '../types';

interface SeoManagerProps {
  title?: string;
  description?: string;
  post?: Post;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description, post }) => {
  useEffect(() => {
    const pageTitle = post ? `${post.title} | Trend Spotter` : title || 'Trend Spotter';
    const pageDescription = post ? post.description : description || '최신 트렌드 및 상품 추천 블로그';
    const keywords = post?.keywords?.join(', ') || 'trend, technology, review, product, lifestyle';

    // Update document title
    document.title = pageTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageDescription);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);


    // Handle JSON-LD schema
    const scriptId = 'json-ld-schema';
    let scriptTag = document.getElementById(scriptId);

    if (post?.schemaJson) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.innerHTML = post.schemaJson;
    } else {
      if (scriptTag) {
        scriptTag.remove();
      }
    }

    // Cleanup function to remove script tag when component unmounts
    return () => {
      const scriptTagToRemove = document.getElementById(scriptId);
      if (scriptTagToRemove) {
        scriptTagToRemove.remove();
      }
    };
  }, [title, description, post]);

  return null; // This component does not render anything
};

export default SeoManager;
