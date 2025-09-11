import React, { useEffect } from 'react';
import { Post, Breadcrumb } from '../types';

interface SeoManagerProps {
  title?: string;
  description?: string;
  post?: Post;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description, post }) => {
  
  useEffect(() => {
    const pageTitle = post?.title || title || 'Trend Spotter';
    const pageDescription = post?.description || description || '최신 트렌드 분석 및 제품 추천 블로그';
    const pageKeywords = post?.keywords?.join(', ') || '';
    const pageImage = post?.coverImage || 'https://cpb-five.vercel.app/logo.svg';
    const canonicalUrl = post 
      ? `https://cpb-five.vercel.app/#/post/${post.slug}` 
      : 'https://cpb-five.vercel.app/';

    // --- Standard Meta Tags ---
    document.title = pageTitle;
    setMetaTag('name', 'description', pageDescription);
    if(pageKeywords) setMetaTag('name', 'keywords', pageKeywords);
    
    // --- Canonical URL ---
    setLinkTag('canonical', canonicalUrl);

    // --- Open Graph (for Facebook, KakaoTalk, etc.) ---
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:type', post ? 'article' : 'website');
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:locale', 'ko_KR');
    
    // --- Twitter Card ---
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', pageImage);
    
    // --- JSON-LD Schema ---
    const schema = generateSchema(pageTitle, pageDescription, canonicalUrl, pageImage, post);
    setSchema(schema);

  }, [post, title, description]);

  const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
    let element = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };
  
  const setLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  const setSchema = (schema: object) => {
    let schemaScript = document.getElementById('json-ld-schema');
    if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'json-ld-schema';
        (schemaScript as HTMLScriptElement).type = 'application/ld+json';
        document.head.appendChild(schemaScript);
    }
    schemaScript.innerHTML = JSON.stringify(schema, null, 2);
  };

  const generateSchema = (pageTitle: string, pageDescription: string, url: string, image: string, post?: Post) => {
      const publisher = {
          '@type': 'Organization',
          name: 'Trend Spotter',
          logo: {
              '@type': 'ImageObject',
              url: 'https://cpb-five.vercel.app/logo.svg',
          },
      };

      const breadcrumbs: Breadcrumb[] = [
        { name: 'Home', path: `#/` },
        ...(post ? [{ name: post.title, path: `#/post/${post.slug}` }] : [])
      ];
      
      const breadcrumbSchema = {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `https://cpb-five.vercel.app/${crumb.path}`,
        })),
      };

      if (post) {
        const postSchema = {
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            image: post.coverImage || image,
            author: {
                '@type': post.author.socialLinks.length > 0 ? 'Person' : 'Organization',
                name: post.author.name,
                url: post.author.socialLinks[0] || undefined,
                sameAs: post.author.socialLinks || undefined
            },
            publisher,
            datePublished: post.date,
            dateModified: post.date,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': url,
            },
        };
        return {'@context': 'https://schema.org', '@graph': [post.schemaJson ? JSON.parse(post.schemaJson) : postSchema, breadcrumbSchema]};
      }

      return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: pageTitle,
          url: url,
          description: pageDescription,
          publisher,
      };
  }

  return null;
};

export default SeoManager;
