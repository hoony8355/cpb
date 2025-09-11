import React from 'react';
import type { Author } from '../types';

interface AuthorBoxProps {
  author: Author;
  date: string;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({ author, date }) => {
  return (
    <div className="flex items-center bg-slate-50 p-4 rounded-lg">
      <img
        src={author.avatar}
        alt={author.name}
        className="w-14 h-14 rounded-full mr-4"
      />
      <div>
        <p className="font-bold text-slate-800">{author.name}</p>
        <p className="text-sm text-slate-500">
          Published on <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </p>
      </div>
    </div>
  );
};

export default AuthorBox;
