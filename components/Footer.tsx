
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-800 text-slate-400 mt-12">
      <div className="container mx-auto px-6 py-4 text-center">
        <p>&copy; {currentYear} My Coupang Partners Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
