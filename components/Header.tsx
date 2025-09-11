// Fix: Implement the Header component to provide site navigation.
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
            Trend Spotter
          </Link>
          <nav>
            {/* Future navigation links can be added here */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
