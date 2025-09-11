import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoManagerProps {
  title: string;
  description: string;
  keywords?: string;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
    </Helmet>
  );
};

export default SeoManager;
