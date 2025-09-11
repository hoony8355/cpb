import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>&copy; {new Date().getFullYear()} AI Tech Blog. Powered by Gemini.</p>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    footer: {
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #eaeaea',
        padding: '2rem 1rem',
        textAlign: 'center',
        marginTop: '2rem',
    },
    text: {
        color: '#6c757d',
        margin: 0,
    }
};

export default Footer;
