import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  postTitle: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ postTitle }) => {
  return (
    <nav className="text-sm mb-4 text-gray-500">
      <Link to="/" className="hover:underline">Home</Link>
      <span className="mx-2">&gt;</span>
      <span>{postTitle}</span>
    </nav>
  );
};

export default Breadcrumbs;
