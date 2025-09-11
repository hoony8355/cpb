import React from 'react';
import { Author } from '../types';

// In a real app, this data would come from a service or CMS
const authors: { [key: string]: Author } = {
  'John Doe': {
    name: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/150?u=john-doe',
    bio: 'John Doe is a front-end developer and tech enthusiast who loves writing about React and modern web technologies.'
  },
  'Jane Smith': {
    name: 'Jane Smith',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane-smith',
    bio: 'Jane Smith is an AI researcher and developer, passionate about making generative AI accessible to everyone.'
  }
};

interface AuthorBoxProps {
  authorName: string;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({ authorName }) => {
  const author = authors[authorName];

  if (!author) {
    return null;
  }

  return (
    <div style={styles.authorBox}>
      <img src={author.avatarUrl} alt={author.name} style={styles.avatar} />
      <div style={styles.authorInfo}>
        <h4 style={styles.authorName}>About {author.name}</h4>
        <p style={styles.authorBio}>{author.bio}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  authorBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '2rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginRight: '1.5rem',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    margin: '0 0 0.5rem 0',
  },
  authorBio: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#333',
  }
};

export default AuthorBox;
