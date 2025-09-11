import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  postTitle: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ postTitle }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex items-center space-x-2 text-gray-500">
        <li>
          <Link to="/" className="hover:text-indigo-600 hover:underline">Home</Link>
        </li>
        <li>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>
        <li className="font-medium text-gray-700 truncate" aria-current="page">
          {postTitle}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
