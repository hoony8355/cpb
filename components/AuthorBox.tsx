import React from 'react';
import type { Author } from '../types';

interface AuthorBoxProps {
  author: Author;
  date: string;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({ author, date }) => {
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-start bg-slate-100 p-6 rounded-xl border border-slate-200">
      <img
        src={author.image}
        alt={author.name}
        className="w-16 h-16 rounded-full mr-5 object-cover shadow-md"
        loading="lazy"
        decoding="async"
      />
      <div className="flex-1">
        <p className="font-bold text-lg text-slate-800">{author.name}</p>
        <p className="text-sm text-slate-600 mt-1">{author.bio}</p>
        <div className="flex items-center justify-between mt-3 text-sm text-slate-500">
          <p>
            게시일: <time dateTime={date}>{formattedDate}</time>
          </p>
          {author.socialLinks && author.socialLinks.length > 0 && (
             <a href={author.socialLinks[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold">
                Follow
             </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorBox;
