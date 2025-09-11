import React from 'react';
import { Author } from '../types';

interface AuthorBoxProps {
  author: Author;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({ author }) => {
  if (!author) return null;

  return (
    <div className="mt-12 bg-gray-100 p-6 rounded-lg flex items-start space-x-6">
      <img 
        src={author.image} 
        alt={author.name} 
        className="w-20 h-20 rounded-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div>
        <h3 className="text-lg font-bold text-gray-800">About {author.name}</h3>
        <p className="mt-2 text-gray-600">{author.bio}</p>
        {author.socialLinks && author.socialLinks.length > 0 && (
          <div className="mt-3">
            <a href={author.socialLinks[0]} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
              Connect
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorBox;
