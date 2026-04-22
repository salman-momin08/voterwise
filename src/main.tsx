import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import ReactDOM from 'react-dom'

// Automated Accessibility Auditing in Development
if (import.meta.env.DEV) {
  const axe = await import('@axe-core/react')
  axe.default(React, ReactDOM, 1000)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
