import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (
      command: 'config',
      targetId: string,
      config?: { page_path?: string }
    ) => void;
  }
}

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-C7J7KFMEJY', {
        page_path: location.pathname + location.hash + location.search,
      });
    }
    window.scrollTo(0, 0);
  }, [location]);
};
