import { useEffect } from 'react';
import { trackClick, Log } from '../utils/storage';

function RedirectHandler({ shortCode }) {
  useEffect(() => {
    const redirect = async () => {
      try {
        const urls = JSON.parse(localStorage.getItem('urls') || '[]');
        const url = urls.find(u => u.shortCode === shortCode);

        if (!url) {
          Log('frontend', 'warn', 'api', 'Invalid shortcode', { shortCode });
          return;
        }

        if (new Date(url.expiresAt) < new Date()) {
          Log('frontend', 'warn', 'api', 'Expired URL accessed', { shortCode });
          return;
        }

        trackClick(shortCode);
        window.location.href = url.originalUrl;

      } catch (error) {
        Log('frontend', 'error', 'api', 'Redirection failed', {
          error: error.message,
          shortCode
        });
      }
    };

    redirect();
  }, [shortCode]);

  return <CircularProgress />;
}