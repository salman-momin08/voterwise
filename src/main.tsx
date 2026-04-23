import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/Common/ErrorBoundary'
import React from 'react'
import ReactDOM from 'react-dom'

// Automated Accessibility Auditing in Development
if (import.meta.env.DEV) {
  const axe = await import('@axe-core/react');
  void axe.default(React, ReactDOM, 1000);
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
