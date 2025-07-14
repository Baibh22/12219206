import { Log } from './logger';

export const storeUrl = (urlData) => {
  const storedUrls = JSON.parse(localStorage.getItem('urls') || '[]');
  
  // Validate uniqueness
  if (storedUrls.some(u => u.shortCode === urlData.shortCode)) {
    Log('frontend', 'error', 'api', 'Duplicate shortcode detected');
    throw new Error('Shortcode already exists');
  }

  const newUrl = {
    ...urlData,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (urlData.validity || 30) * 60000).toISOString(),
    clicks: []
  };

  localStorage.setItem('urls', JSON.stringify([...storedUrls, newUrl]));
  Log('frontend', 'info', 'api', 'URL stored successfully', {
    shortCode: newUrl.shortCode
  });
};

export const trackClick = (shortCode) => {
  const urls = JSON.parse(localStorage.getItem('urls') || '[]');
  const url = urls.find(u => u.shortCode === shortCode);

  if (url) {
    url.clicks.push({
      timestamp: new Date().toISOString(),
      source: document.referrer || 'direct',
      location: navigator.language
    });
    
    localStorage.setItem('urls', JSON.stringify(urls));
    Log('frontend', 'debug', 'api', 'Click tracked', { shortCode });
  }
};

const generateShortCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array(8)
    .fill('')
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('');
};