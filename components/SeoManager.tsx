import React, { useEffect } from 'react';
import type { Post } from '../types';

interface SeoManagerProps {
  title: string;
  description: string;
  keywords?: string[];
  imageUrl?: string;
  post?: Post;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description, keywords, imageUrl, post }) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper functions to create/update meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }

    // 3. Update Open Graph & Twitter Card tags for social sharing
    const currentUrl = window.location.href;
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', post ? 'article' : 'website');
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:site_name', 'Trend Spotter');
    if (imageUrl) {
      setMetaTag('property', 'og:image', imageUrl);
    }
    
    setMetaTag('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    if (imageUrl) {
        setMetaTag('name', 'twitter:image', imageUrl);
    }

    // 4. Update JSON-LD Schema for rich results
    let schemaElement = document.getElementById('json-ld-schema');
    if (!schemaElement) {
        schemaElement = document.createElement('script');
        schemaElement.id = 'json-ld-schema';
        (schemaElement as HTMLScriptElement).type = 'application/ld+json';
        document.head.appendChild(schemaElement);
    }

    // **INTELLIGENT SCHEMA LOGIC**
    // If the post has a pre-defined schema in its markdown, use it.
    // Otherwise, generate a basic one.
    if (post?.schemaJson) {
      schemaElement.innerHTML = post.schemaJson;
    } else {
      let schema: object;
      if (post) {
        schema = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': currentUrl,
          },
          'headline': post.title,
          'description': post.description,
          'image': post.coverImage || '',
          'author': {
            '@type': 'Organization',
            'name': 'Trend Spotter',
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Trend Spotter',
            'logo': {
              '@type': 'ImageObject',
              'url': `${window.location.origin}/vite.svg`,
            },
          },
          'datePublished': post.date,
          'dateModified': post.date,
        };
      } else {
          schema = {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              'url': window.location.origin,
              'name': title,
              'description': description,
          };
      }
      schemaElement.innerHTML = JSON.stringify(schema, null, 2);
    }

  }, [title, description, keywords, imageUrl, post]);

  return null; // This component does not render any UI
};

export default SeoManager;
