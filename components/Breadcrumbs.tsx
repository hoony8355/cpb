import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  postTitle: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ postTitle }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
      <ol className="list-none p-0 inline-flex items-center">
        <li className="flex items-center">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        </li>
        <li className="flex items-center mx-2" aria-hidden="true">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
        </li>
        <li className="flex items-center">
          <span className="font-medium text-slate-700 truncate" style={{maxWidth: '200px'}}>{postTitle}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
