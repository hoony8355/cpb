import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoManagerProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article';
}

const SeoManager: React.FC<SeoManagerProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  type = 'website',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index,follow,max-image-preview:large" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SeoManager;
