
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <Link to="/" className="text-2xl font-bold hover:text-slate-300 transition-colors">
          My Coupang Partners Blog
        </Link>
      </div>
    </header>
  );
};

export default Header;
