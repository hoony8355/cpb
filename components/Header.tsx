import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '960px', margin: '0 auto' }}>
                <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', fontSize: '1.5rem' }}>My Gemini Blog</Link>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '1rem' }}>
                    <li><Link to="/">Home</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
