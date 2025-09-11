
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#38bdf8"/>
            <circle cx="12" cy="12" r="3" fill="#0ea5e9"/>
            <path d="M12 7c-2.76 0-5 2.24-5 5h2c0-1.65 1.35-3 3-3s3 1.35 3 3h2c0-2.76-2.24-5-5-5z" fill="white" fillOpacity="0.5"/>
          </svg>
          <span className="bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">Trend Spotter</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
