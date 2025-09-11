import { useEffect } from 'react';
import { Post } from '../types';

// FIX: Make props flexible to be used on pages without a `post` object, like the homepage. This resolves the props error in HomePage.tsx.
interface SeoManagerProps {
  post?: Post;
  title?: string;
  description?: string;
}

const SeoManager: React.FC<SeoManagerProps> = ({ post, title, description }) => {
  useEffect(() => {
    // Post page SEO logic
    if (post) {
      // Basic SEO tags
      document.title = post.title;
      setMetaTag('description', post.description);
      setMetaTag('keywords', post.keywords.join(', '));

      // FIX: Use `window.location.href` for canonical URL, which is correct for a HashRouter setup.
      // Canonical URL
      setLinkTag('canonical', window.location.href);

      // Open Graph
      setMetaTag('og:title', post.title);
      setMetaTag('og:description', post.description);
      setMetaTag('og:type', 'article');
      setMetaTag('og:url', window.location.href);
      setMetaTag('og:image', post.coverImage || 'https://cpb-five.vercel.app/default-og-image.png');
      setMetaTag('og:locale', 'ko_KR');

      // Twitter Card
      setMetaTag('twitter:card', 'summary_large_image');
      setMetaTag('twitter:title', post.title);
      setMetaTag('twitter:description', post.description);
      setMetaTag('twitter:image', post.coverImage || 'https://cpb-five.vercel.app/default-og-image.png');

      // JSON-LD Schema
      const baseUrl = window.location.origin;
      const breadcrumbs = [
          { name: "Home", path: "/" },
          { name: post.title, path: `/post/${post.slug}` }
      ];

      // FIX: Add an explicit type to `baseSchema`'s `@graph` property to allow pushing different schema object types, resolving a TypeScript error.
      const baseSchema: { "@context": string, "@graph": any[] } = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`,
            "url": baseUrl,
            "name": "Trend Spotter",
            "publisher": { "@id": `${baseUrl}/#organization` }
          },
          {
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            "name": "Trend Spotter",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.svg` // Assuming you have a logo file
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": `${baseUrl}/#${crumb.path}` // Correct breadcrumb item URL for HashRouter
            }))
          }
        ]
      };

      if (post.schemaJson) {
        try {
          const customSchema = JSON.parse(post.schemaJson);
          baseSchema["@graph"].push(...(Array.isArray(customSchema) ? customSchema : [customSchema]));
        } catch (e) {
          console.error("Failed to parse custom schema JSON", e);
        }
      } else {
         baseSchema["@graph"].push({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "image": post.coverImage || `${baseUrl}/default-og-image.png`,
            "datePublished": new Date(post.date).toISOString(),
            "dateModified": new Date(post.date).toISOString(),
            "author": {
              "@type": post.author.bio ? "Person" : "Organization",
              "name": post.author.name,
              ...(post.author.socialLinks && post.author.socialLinks.length > 0 && { "sameAs": post.author.socialLinks })
            },
            "publisher": { "@id": `${baseUrl}/#organization` },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
            }
          });
      }

      setSchema(baseSchema);

    // General page SEO logic (e.g., HomePage)
    } else if (title && description) {
        document.title = title;
        setMetaTag('description', description);
        setMetaTag('keywords', 'Trend Spotter, 최신 트렌드, 상품 추천, 기술, 라이프스타일, 리뷰, 가이드');

        setLinkTag('canonical', window.location.href);

        setMetaTag('og:title', title);
        setMetaTag('og:description', description);
        setMetaTag('og:type', 'website');
        setMetaTag('og:url', window.location.href);
        setMetaTag('og:image', 'https://cpb-five.vercel.app/default-og-image.png');
        setMetaTag('og:locale', 'ko_KR');

        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', title);
        setMetaTag('twitter:description', description);
        setMetaTag('twitter:image', 'https://cpb-five.vercel.app/default-og-image.png');

        const baseUrl = window.location.origin;
        const baseSchema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${baseUrl}/#website`,
                    "url": baseUrl,
                    "name": "Trend Spotter",
                    "publisher": { "@id": `${baseUrl}/#organization` }
                },
                {
                    "@type": "Organization",
                    "@id": `${baseUrl}/#organization`,
                    "name": "Trend Spotter",
                    "url": baseUrl,
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${baseUrl}/logo.svg`
                    }
                }
            ]
        };
        setSchema(baseSchema);
    }
  }, [post, title, description]);

  return null;
};

const setMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const setLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if(!element){
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }
    element.setAttribute('href', href);
}

const setSchema = (schema: object) => {
  const id = 'app-schema';
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.setAttribute('type', 'application/ld+json');
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(schema);
};

export default SeoManager;
