import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';
import usePageTracking from '../hooks/usePageTracking';

const NotFoundPage: React.FC = () => {
  usePageTracking();
  return (
    <div className="text-center py-16">
      <SeoManager title="Page Not Found" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
