import React from 'react';

// In a real application, you would use a library like react-helmet-async for full SEO management.
// This is a simplified version for demonstration purposes.

interface SeoManagerProps {
    title: string;
    description: string;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description }) => {
    React.useEffect(() => {
        document.title = `${title} | My Awesome Blog`;
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);

    }, [title, description]);

    return null; // This component doesn't render anything
};

export default SeoManager;
