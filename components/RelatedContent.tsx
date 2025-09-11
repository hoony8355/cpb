import React, { useEffect, useState } from 'react';
import { getRelatedTopics } from '../services/geminiService';

interface RelatedContentProps {
  postContent: string;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ postContent }) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postContent) {
      setLoading(true);
      setError(null);
      getRelatedTopics(postContent)
        .then(setTopics)
        .catch(() => setError("Failed to load related topics."))
        .finally(() => setLoading(false));
    }
  }, [postContent]);

  if (loading) {
    return <div style={styles.container}>Loading related topics...</div>;
  }

  if (error) {
    return <div style={{...styles.container, ...styles.error}}>{error}</div>
  }
  
  if (topics.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>AI-Generated Related Topics</h3>
      <ul style={styles.list}>
        {topics.map((topic, index) => (
          <li key={index} style={styles.listItem}>{topic}</li>
        ))}
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '2rem',
  },
  title: {
    marginTop: 0,
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'disc',
    paddingLeft: '20px',
    margin: 0,
  },
  listItem: {
    marginBottom: '0.5rem',
  },
  error: {
      color: '#dc3545',
  }
};


export default RelatedContent;
