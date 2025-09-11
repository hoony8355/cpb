import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This is a mock hook for page tracking. In a real application, you would
// integrate with an analytics service like Google Analytics.

const trackPage = (path: string) => {
    console.log(`Page view tracked for: ${path}`);
    // Example with Google Analytics:
    // if (window.gtag) {
    //   window.gtag('config', 'GA_TRACKING_ID', {
    //     'page_path': path,
    //   });
    // }
};

const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        trackPage(location.pathname + location.search);
    }, [location]);
};

export default usePageTracking;
