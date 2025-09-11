import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-16">
      <div className="container mx-auto px-4 sm:px-6 py-6 text-center text-slate-500">
        <p>&copy; {currentYear} Trend Spotter. All rights reserved.</p>
        <p className="text-xs mt-2">
          This site is a participant in the Coupang Partners Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to coupang.com.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
