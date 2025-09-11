
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
    return <div className="text-sm text-gray-500 text-center my-4">관련 콘텐츠를 찾는 중...</div>;
  }

  if (ideas.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-slate-50 rounded-lg">
      <h4 className="font-bold text-md text-slate-800 mb-2">함께 보면 좋은 글</h4>
      <ul className="list-disc list-inside space-y-1">
        {ideas.map((idea, index) => (
          <li key={index} className="text-sm text-slate-600 hover:text-sky-600">
            <a href="#">{idea}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedContent;
