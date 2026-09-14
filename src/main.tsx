import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize performance monitoring
if (import.meta.env.DEV) {
  console.log(
    '%c🚀 StoreFront',
    'color: #5c7cfa; font-size: 24px; font-weight: bold;',
    '\nDigital Storefront SaaS Platform'
  );
  console.log(
    '%c📦 Environment: Development',
    'color: #fbbf24; font-size: 12px;'
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
