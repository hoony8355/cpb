import React from 'react';

// In a real app, this would fetch author details from a service
const authorDetails = {
    'Jane Doe': {
        bio: 'Jane is a Staff Engineer focused on AI and developer tools.',
        avatarUrl: `https://i.pravatar.cc/150?u=jane_doe`
    },
    'John Smith': {
        bio: 'John is a frontend expert who loves React and TypeScript.',
        avatarUrl: `https://i.pravatar.cc/150?u=john_smith`
    }
}

interface AuthorBoxProps {
    authorName: string;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({ authorName }) => {
    const author = authorName in authorDetails ? authorDetails[authorName as keyof typeof authorDetails] : null;

    if (!author) {
        return null;
    }

    return (
        <div className="author-box" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={author.avatarUrl} alt={authorName} style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
            <div className="author-info">
                <h3 style={{ margin: '0 0 0.5rem 0' }}>About {authorName}</h3>
                <p style={{ margin: 0 }}>{author.bio}</p>
            </div>
        </div>
    );
};

export default AuthorBox;
