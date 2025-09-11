import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';

const NotFoundPage: React.FC = () => {
  return (
    <>
    <SeoManager
        title="404 - 페이지를 찾을 수 없습니다"
        description="요청하신 페이지를 찾을 수 없습니다. 주소가 올바른지 확인해주세요."
    />
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Page Not Found</h2>
      <p className="mt-4 text-base text-gray-600">죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        홈으로 돌아가기
      </Link>
    </div>
    </>
  );
};

export default NotFoundPage;
