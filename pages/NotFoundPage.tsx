import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SeoManager
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
      />
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-6xl font-extrabold text-slate-800">404</h1>
        <p className="text-2xl font-semibold text-slate-600 mt-4">Page Not Found</p>
        <p className="text-slate-500 mt-2">Sorry, the page you are looking for could not be found.</p>
        <Link 
          to="/"
          className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Go back to Homepage
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
