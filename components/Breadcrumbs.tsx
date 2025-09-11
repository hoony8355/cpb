import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
    postTitle: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ postTitle }) => {
    return (
        <nav aria-label="breadcrumb" style={{ marginBottom: '1rem', color: '#555' }}>
            <Link to="/">Home</Link>
            <span> / </span>
            <span>{postTitle}</span>
        </nav>
    );
};

export default Breadcrumbs;
