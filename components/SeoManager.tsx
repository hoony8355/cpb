import React, { useEffect } from 'react';

interface SeoManagerProps {
  title: string;
  description: string;
  keywords?: string;
  schemaJson?: string;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description, keywords, schemaJson }) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    if (keywords) {
      setMeta('keywords', keywords);
    }
    
    // Handle JSON-LD schema
    const schemaScriptId = 'json-ld-schema';
    let schemaScript = document.getElementById(schemaScriptId);

    if (schemaJson) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = schemaScriptId;
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.innerHTML = schemaJson;
    } else if (schemaScript) {
      // Remove script if it exists but no schema is provided for the current page
      schemaScript.remove();
    }
    
    // Cleanup function to remove schema when component unmounts
    return () => {
        const schemaScriptToRemove = document.getElementById(schemaScriptId);
        if (schemaScriptToRemove) {
          schemaScriptToRemove.remove();
        }
    };

  }, [title, description, keywords, schemaJson]);

  return null; // This component does not render anything to the DOM
};

export default SeoManager;
