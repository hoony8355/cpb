import React from 'react';
import { Link } from 'react-router-dom';
import type { Breadcrumb } from '../types';

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
      <ol className="list-none p-0 inline-flex items-center flex-wrap">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            {index < items.length - 1 ? (
              <>
                <Link to={item.path} className="hover:text-blue-600 transition-colors">
                  {item.name}
                </Link>
                <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              </>
            ) : (
              <span className="font-medium text-slate-700 truncate" style={{maxWidth: '20rem'}}>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
