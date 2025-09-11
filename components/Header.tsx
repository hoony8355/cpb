import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-8 w-8">
                <rect width="100" height="100" rx="20" fill="#e0f2fe"></rect>
                <path d="M30 70 L50 30 L70 70 Z" fill="#38bdf8"></path>
                <path d="M45 60 L60 40 L75 60 Z" fill="#0ea5e9" fillOpacity="0.8"></path>
            </svg>
            <span className="text-xl font-extrabold">Trend Spotter</span>
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
