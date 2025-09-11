import React, { useEffect, useState } from 'react';
import { generateRelatedContentIdeas } from '../services/geminiService';

interface RelatedContentProps {
  productName: string;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ productName }) => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    generateRelatedContentIdeas(productName)
      .then(setIdeas)
      .finally(() => setLoading(false));
  }, [productName]);

  if (loading) {
    return (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
            </div>
        </div>
    );
  }

  if (ideas.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
      <h4 className="text-md font-bold text-indigo-800">함께 보면 좋은 글</h4>
      <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-indigo-700">
        {ideas.map((idea, index) => (
          <li key={index}>{idea}</li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedContent;
