import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ padding: '20px', backgroundColor: '#f0f0f0', borderTop: '1px solid #ddd', marginTop: 'auto', textAlign: 'center' }}>
      <p>&copy; {new Date().getFullYear()} My Awesome Blog. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
