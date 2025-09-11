
import React from 'react';
import { Author } from '../types';

interface AuthorBoxProps {
  author: Author;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({ author }) => {
  return (
    <div className="mt-12 pt-8 border-t">
      <div className="flex items-center gap-4">
        <img 
            src={author.image || 'https://source.unsplash.com/random/100x100?avatar'} 
            alt={author.name} 
            className="w-16 h-16 rounded-full object-cover"
            loading="lazy"
            decoding="async"
        />
        <div>
          <p className="text-sm text-gray-500">작성자</p>
          <h4 className="font-bold text-lg text-gray-900">{author.name}</h4>
          {author.bio && <p className="text-sm text-gray-600 mt-1">{author.bio}</p>}
          {author.socialLinks && author.socialLinks.length > 0 && (
            <div className="mt-2 flex gap-3">
              {author.socialLinks.map(link => (
                <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-700">
                  Social
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorBox;
