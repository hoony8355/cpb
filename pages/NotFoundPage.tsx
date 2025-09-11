
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-6xl font-extrabold text-sky-500">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">페이지를 찾을 수 없습니다.</h2>
      <p className="text-gray-500 mb-6">요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있습니다.</p>
      <Link 
        to="/"
        className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFoundPage;
