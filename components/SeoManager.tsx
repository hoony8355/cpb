import React, { useEffect } from 'react';

interface SeoManagerProps {
  title: string;
  description: string;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description }) => {
  useEffect(() => {
    document.title = title;
    
    // Manage meta description tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

  }, [title, description]);

  return null; // This component does not render anything to the DOM
};

export default SeoManager;
