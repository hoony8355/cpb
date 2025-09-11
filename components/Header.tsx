import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <Link to="/" className="text-3xl font-extrabold text-slate-900 hover:text-blue-600 transition-colors duration-300">
          Trend Spotter
        </Link>
      </div>
    </header>
  );
};

export default Header;