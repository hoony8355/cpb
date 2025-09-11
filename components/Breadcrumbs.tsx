
import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  postTitle: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ postTitle }) => {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-4">
      <Link to="/" className="hover:text-sky-600">홈</Link>
      <span className="mx-2">/</span>
      <span className="text-gray-700">{postTitle}</span>
    </nav>
  );
};

export default Breadcrumbs;
