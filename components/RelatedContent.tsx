import React, { useState, useEffect } from 'react';
import { generateRelatedContentIdeas } from '../services/geminiService';

interface RelatedContentProps {
  productTitle: string;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ productTitle }) => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Basic check to avoid calling API for generic titles
    if (productTitle.length < 5 || !process.env.API_KEY) {
        return;
    }
    
    setIsLoading(true);
    generateRelatedContentIdeas(productTitle)
      .then(setIdeas)
      .finally(() => setIsLoading(false));
  }, [productTitle]);

  if (isLoading) {
    return (
      <div className="my-10 p-6 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-3">AI가 관련 콘텐츠를 찾고 있어요...</h4>
        <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return null; // Don't render if no ideas were generated
  }

  return (
    <div className="my-10 p-6 bg-sky-50 rounded-lg border border-sky-200">
        <h4 className="font-bold text-sky-800 mb-3">💡 관련 콘텐츠 아이디어</h4>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
            {ideas.map((idea, index) => (
                <li key={index}>{idea}</li>
            ))}
        </ul>
    </div>
  );
};

export default RelatedContent;
