import { useEffect } from 'react';
import type { Author, Breadcrumb } from '../types';

interface SeoManagerProps {
  title: string;
  description: string;
  keywords?: string;
  schemaJson?: string;
  author?: Author;
  postDate?: string;
  coverImage?: string;
  breadcrumbs?: Breadcrumb[];
}

const SeoManager: React.FC<SeoManagerProps> = ({ 
  title, 
  description, 
  keywords, 
  schemaJson,
  author,
  postDate,
  coverImage,
  breadcrumbs
}) => {
  useEffect(() => {
    const siteUrl = window.location.origin + window.location.pathname.split('#')[0];
    const pageUrl = window.location.href;

    document.title = title;

    const setMeta = (propName: 'name' | 'property', propValue: string, content: string) => {
      let element = document.querySelector(`meta[${propName}="${propValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(propName, propValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', description);
    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    // Open Graph (for social sharing)
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', postDate ? 'article' : 'website');
    setMeta('property', 'og:url', pageUrl);
    if (coverImage) {
        setMeta('property', 'og:image', coverImage);
    }
    setMeta('property', 'og:locale', 'ko_KR');


    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (coverImage) {
        setMeta('name', 'twitter:image', coverImage);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageUrl);

    // JSON-LD schema
    const schemaScriptId = 'json-ld-schema';
    let schemaScript = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (schemaScript) {
      schemaScript.remove();
    }
    
    schemaScript = document.createElement('script');
    schemaScript.id = schemaScriptId;
    schemaScript.type = 'application/ld+json';
    
    let schema: any = {};

    if (schemaJson) {
      try {
        schema = JSON.parse(schemaJson);
      } catch (e) {
        console.error("Failed to parse schemaJson from markdown", e);
        schema = {};
      }
    } else if (postDate && author) { // Article schema
      schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": coverImage,
        "datePublished": postDate,
        "author": {
          "@type": author.socialLinks && author.socialLinks.length > 0 ? "Person" : "Organization",
          "name": author.name,
          "url": author.socialLinks && author.socialLinks.length > 0 ? author.socialLinks[0] : undefined,
          "image": author.image,
          "sameAs": author.socialLinks || []
        },
        "publisher": {
            "@type": "Organization",
            "name": "Trend Spotter",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}logo.svg`
            }
        }
      };
    } else { // Website schema for homepage
        schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": siteUrl,
            "name": "Trend Spotter",
            "description": description
        };
    }
    
    if (breadcrumbs && breadcrumbs.length > 0) {
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": `${siteUrl}#${item.path}`
            }))
        };
        
        const existingGraph = schema['@graph'];
        if (Array.isArray(existingGraph)) {
            existingGraph.push(breadcrumbSchema);
        } else if (Object.keys(schema).length > 0) {
            schema = {
                "@context": "https://schema.org",
                "@graph": [schema, breadcrumbSchema]
            };
        } else {
            schema = breadcrumbSchema;
        }
    }

    schemaScript.innerHTML = JSON.stringify(schema, null, 2);
    document.head.appendChild(schemaScript);

  }, [title, description, keywords, schemaJson, author, postDate, coverImage, breadcrumbs]);

  return null;
};

export default SeoManager;
