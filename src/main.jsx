import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
// Self-hosted fonts — served from our own domain, no Google CDN
// (avoids leaking visitor IPs to Google; also loads faster).
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#111113',
          border: '1px solid #27272A',
          color: '#F5F5F4',
          fontFamily: 'Satoshi, sans-serif',
          fontSize: '14px',
        },
      }}
      richColors
    />
  </StrictMode>,
)
