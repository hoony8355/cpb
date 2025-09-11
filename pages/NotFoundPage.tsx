import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';

const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <SeoManager 
        title="404 - Page Not Found" 
        description="The page you are looking for does not exist." 
      />
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>Oops! The page you're looking for could not be found.</p>
      <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center'
    },
    title: {
        fontSize: '6rem',
        fontWeight: 'bold',
        margin: 0,
        color: '#333'
    },
    message: {
        fontSize: '1.25rem',
        margin: '1rem 0 2rem 0',
        color: '#666'
    },
    link: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#0070f3',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
    }
};

export default NotFoundPage;
