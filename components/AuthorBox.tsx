import React from 'react';
import { Author } from '../types';

// Mock author data since we don't have a separate service for it
const MOCK_AUTHORS: { [key: string]: Author } = {
    'John Doe': {
        name: 'John Doe',
        bio: 'A passionate developer exploring the world of web technologies and AI.',
        avatarUrl: 'https://i.pravatar.cc/150?u=john-doe'
    },
    'Jane Smith': {
        name: 'Jane Smith',
        bio: 'Frontend expert with a love for clean code, good UX, and React.',
        avatarUrl: 'https://i.pravatar.cc/150?u=jane-smith'
    }
};

const AuthorBox: React.FC<{ authorName: string }> = ({ authorName }) => {
    const author = MOCK_AUTHORS[authorName];
    if (!author) return null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px', marginTop: '32px' }}>
            <img src={author.avatarUrl} alt={author.name} style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '16px' }} />
            <div>
                <h4 style={{ margin: '0 0 8px 0' }}>About {author.name}</h4>
                <p style={{ margin: 0 }}>{author.bio}</p>
            </div>
        </div>
    );
};

export default AuthorBox;
