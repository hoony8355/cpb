import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={{ padding: '20px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
      <nav>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          My Awesome Blog
        </Link>
        {/* Add other nav links here if needed */}
      </nav>
    </header>
  );
};

export default Header;
