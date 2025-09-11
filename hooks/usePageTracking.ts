import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track page views and scroll to the top on navigation.
 * This is a foundational implementation that can be extended with an analytics service.
 */
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // In a real-world application, you would integrate with an analytics
    // service like Google Analytics here. For now, we'll log to the console.
    console.log(`Navigated to ${location.pathname}${location.search}`);

    // Scroll to the top of the page on route change
    window.scrollTo(0, 0);
  }, [location]);
};

export default usePageTracking;
