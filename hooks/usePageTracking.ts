import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // This is a mock tracking service. In a real app, you would integrate
    // with a service like Google Analytics here, sending the location.pathname.
    console.log(`Page view tracked for: ${location.pathname}`);
  }, [location]);
};

export default usePageTracking;
