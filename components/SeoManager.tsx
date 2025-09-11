import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoManagerProps {
  title: string;
  description?: string;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description }) => {
  const siteTitle = 'My Tech Blog';
  const fullTitle = `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default SeoManager;
