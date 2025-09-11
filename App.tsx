import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePageTracking } from './hooks/usePageTracking';

import Header from './components/Header';
import Footer from './components/Footer';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const PostPage = React.lazy(() => import('./pages/PostPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  usePageTracking();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
         <Suspense fallback={<div className="text-center py-20">Loading page...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:slug" element={<PostPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
         </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
