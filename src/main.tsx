import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './app/App'
import './styles/global.css'

// A service worker requires HTTPS outside localhost.  Keeping it out of the
// development server avoids Safari retaining a stale development build when
// the app is opened from a LAN IP address.
if (import.meta.env.PROD) {
  registerSW({ immediate: true })
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
