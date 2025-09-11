import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  postTitle: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ postTitle }) => {
  return (
    <nav aria-label="breadcrumb" style={styles.nav}>
      <ol style={styles.breadcrumb}>
        <li style={styles.breadcrumbItem}>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        <li style={{...styles.breadcrumbItem, ...styles.active}} aria-current="page">
          {postTitle}
        </li>
      </ol>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        marginBottom: '1.5rem',
    },
    breadcrumb: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
    },
    breadcrumbItem: {
        fontSize: '0.9rem',
    },
    link: {
        textDecoration: 'none',
        color: '#0070f3',
    },
    active: {
        color: '#6c757d',
        pointerEvents: 'none'
    }
};


// Add separator
styles.breadcrumbItem[':not(:last-child)::after'] = {
    content: '"/"',
    margin: '0 0.5rem',
    color: '#6c757d',
};

export default Breadcrumbs;
