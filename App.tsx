import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// FIX: Import HelmetProvider to wrap the application for SEO management.
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import usePageTracking from './hooks/usePageTracking';

// Lazy load pages for code splitting and improved initial load time.
const HomePage = lazy(() => import('./pages/HomePage'));
const PostPage = lazy(() => import('./pages/PostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * A wrapper component that applies the page tracking hook.
 * This is necessary because the hook relies on `useLocation`, which must be
 * used within the context of a Router.
 */
const AppContent: React.FC = () => {
  usePageTracking();
  return (
    <Suspense fallback={<div className="text-center p-10">Loading page...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

/**
 * The main application component. It sets up the router, layout, and routes.
 */
const App: React.FC = () => {
  return (
    // FIX: Wrap the entire application in HelmetProvider.
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
          <Header />
          <main className="flex-grow">
            <AppContent />
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
