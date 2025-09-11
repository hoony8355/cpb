import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface RelatedContentProps {
  postTitle: string;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ postTitle }) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedTopics = async () => {
      setLoading(true);
      setError(null);
      try {
        const relatedTopics = await geminiService.getRelatedTopics(postTitle);
        setTopics(relatedTopics);
      } catch (err) {
        console.error("Failed to fetch related content:", err);
        setError("Could not load related topics.");
      } finally {
        setLoading(false);
      }
    };

    if (postTitle) {
      fetchRelatedTopics();
    }
  }, [postTitle]);

  if (loading) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Related Concepts</h2>
        <p className="text-gray-600">Generating ideas with Gemini...</p>
      </div>
    );
  }

  if (error || topics.length === 0) {
    return null; // Don't render the component if there's an error or no topics
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Related Concepts (from Gemini)</h2>
      <ul className="list-disc list-inside space-y-2">
        {topics.map((topic, index) => (
          <li key={index} className="text-gray-700">{topic}</li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedContent;
