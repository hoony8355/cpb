import { useEffect } from 'react';

interface SeoManagerProps {
    title: string;
    description: string;
    keywords?: string;
}

const SeoManager: React.FC<SeoManagerProps> = ({ title, description, keywords }) => {
    useEffect(() => {
        document.title = title;

        const setMetaTag = (name: string, content: string) => {
            // Remove existing tag
            const existingElement = document.querySelector(`meta[name="${name}"]`);
            if (existingElement) {
                existingElement.remove();
            }
            // Add new tag
            const element = document.createElement('meta');
            element.setAttribute('name', name);
            element.setAttribute('content', content);
            document.head.appendChild(element);
        };
        
        setMetaTag('description', description);
        if (keywords) {
            setMetaTag('keywords', keywords);
        }

    }, [title, description, keywords]);

    return null; // This component does not render anything
};

export default SeoManager;
