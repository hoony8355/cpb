import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
    postTitle?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ postTitle }) => {
    return (
        <nav aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
            <Link to="/">Home</Link>
            {postTitle && <span> / {postTitle}</span>}
        </nav>
    );
};

export default Breadcrumbs;
