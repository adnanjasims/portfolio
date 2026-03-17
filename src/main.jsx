import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// StrictMode off so Kaboom mounts once and the canvas does not re-init
console.log('[Portfolio] main.jsx: mounting app with ErrorBoundary')
createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
