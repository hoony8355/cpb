import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This is a mock analytics service. In a real app, you would integrate
// with a service like Google Analytics, Plausible, or a custom backend.
const analyticsService = {
  trackPage: (path: string) => {
    // Example: send a 'page_view' event to an analytics service
    console.log(`Analytics: Page view tracked for "${path}"`);
    /* 
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
      });
    }
    */
  }
};

/**
 * Custom hook that tracks page views whenever the route changes.
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // The path includes the pathname and search query string
    const currentPath = location.pathname + location.search;
    analyticsService.trackPage(currentPath);
  }, [location]);
};
