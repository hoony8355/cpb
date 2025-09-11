import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0);

    // Track page view with Google Analytics
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-C7J7KFMEJY', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};

export default usePageTracking;
