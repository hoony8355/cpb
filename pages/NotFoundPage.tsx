import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <SeoManager 
        title="Page Not Found" 
        description="The page you are looking for does not exist." 
      />
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
};

export default NotFoundPage;
