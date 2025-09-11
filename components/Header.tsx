import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
          My Tech Blog
        </Link>
      </div>
    </header>
  );
};

export default Header;
