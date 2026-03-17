import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
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
