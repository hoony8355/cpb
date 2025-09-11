import React, { useEffect } from 'react';
import { Post } from '../types';

interface SeoManagerProps {
  title?: string;
  description?: string;
  post?: Post;
}

// Helper to set/update a meta tag
const setMetaTag = (nameOrProperty: 'name' | 'property', value: string, content: string) => {
  const selector = `meta[${nameOrProperty}="${value}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(nameOrProperty, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

// Helper to remove a meta tag if content is empty
const removeMetaTag = (nameOrProperty: 'name' | 'property', value: string) => {
    const selector = `meta[${nameOrProperty}="${value}"]`;
    const element = document.head.querySelector(selector);
    if (element) {
        element.remove();
    }
};

const SeoManager: React.FC<SeoManagerProps> = ({ title, description, post }) => {
  useEffect(() => {
    // Determine SEO values from props
    const pageTitle = post?.title || title || 'Trend Spotter';
    const pageDescription = post?.description || description || '최신 기술, 제품, 라이프스타일 트렌드를 분석하고 최고의 상품을 추천하는 블로그입니다.';
    const pageKeywords = post?.keywords?.join(', ') || '';
    const pageAuthor = post?.author?.name || 'Trend Spotter 콘텐츠 팀';
    // Use a generic OG image for the homepage, and specific for posts
    const ogImage = post?.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';

    // 1. Update document title
    document.title = pageTitle;

    // 2. Update standard meta tags
    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'author', pageAuthor);
    if(pageKeywords) {
        setMetaTag('name', 'keywords', pageKeywords);
    } else {
        removeMetaTag('name', 'keywords');
    }

    // 3. Update Open Graph meta tags for social sharing
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:type', post ? 'article' : 'website');
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'Trend Spotter');

    // 4. Update Twitter Card meta tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Manage JSON-LD schema script for rich snippets
    const existingSchemaScript = document.getElementById('json-ld-schema');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }
    
    if (post?.schemaJson) {
      try {
        // Validate JSON before injecting
        JSON.parse(post.schemaJson);
        const script = document.createElement('script');
        script.id = 'json-ld-schema';
        script.type = 'application/ld+json';
        script.innerHTML = post.schemaJson;
        document.head.appendChild(script);
      } catch (e) {
        console.error("Failed to parse schemaJson:", e);
      }
    }
  }, [title, description, post]);

  return null; // This component is side-effect only and does not render DOM elements
};

export default SeoManager;
