import React from 'react';
import { Author } from '../types';

interface AuthorBoxProps {
  author: Author;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({ author }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg flex flex-col sm:flex-row items-center text-center sm:text-left">
      <img src={author.avatarUrl} alt={author.name} className="w-20 h-20 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0" />
      <div>
        <h3 className="text-xl font-bold mb-1">About {author.name}</h3>
        <p className="text-gray-700">{author.bio}</p>
      </div>
    </div>
  );
};

export default AuthorBox;
