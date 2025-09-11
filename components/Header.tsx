import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          AI Tech Blog
        </Link>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <NavLink to="/" style={styles.navLink} className={({ isActive }) => isActive ? 'active' : ''}>
                Home
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #eaeaea',
    padding: '1rem 0',
  },
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    textDecoration: 'none',
    color: '#333',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
  },
  navItem: {
    marginLeft: '1.5rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#555',
    fontSize: '1rem',
  }
};

export default Header;
