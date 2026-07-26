import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@styles/index.css'

/**
 * Application entry point. Keep this file free of business logic -- it only
 * mounts <App /> into the DOM. All cross-cutting providers (React Query,
 * Router, Toaster) live in src/app/providers/AppProviders.jsx and are
 * composed inside App.jsx, not here.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
