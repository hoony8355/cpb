import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ padding: '2rem', borderTop: '1px solid #ccc', textAlign: 'center', marginTop: '2rem' }}>
            <p>&copy; {new Date().getFullYear()} My Gemini Blog. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
