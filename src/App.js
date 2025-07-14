import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<ShortenerForm />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/:shortCode"
            element={<RedirectHandler />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

function RedirectHandler({ shortCode }) {
  useEffect(() => {
    Log('frontend', 'info', 'api', 'Redirect attempt', { shortCode });
    // Redirection logic
  }, [shortCode]);
}

useEffect(() => {
  const cleanupInterval = setInterval(() => {
    const urls = JSON.parse(localStorage.getItem('urls') || '[]');
    const validUrls = urls.filter(url => new Date(url.expiresAt) > new Date());
    localStorage.setItem('urls', JSON.stringify(validUrls));
    Log('frontend', 'info', 'api', 'Performed expired URL cleanup');
  }, 300000); // 5 minutes

  return () => clearInterval(cleanupInterval);
}, []);