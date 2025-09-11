import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#4F46E5"/>
      <path d="M12 2L22 7L12 12L2 7L12 2Z" fill="#818CF8"/>
      <path d="M2 17L12 22L12 12L2 7V17Z" fill="#6366F1"/>
      <path d="M22 17L12 22L12 12L22 7V17Z" fill="#A5B4FC"/>
    </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold text-gray-800">Trend Spotter</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
