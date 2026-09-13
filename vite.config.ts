import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repository ? `/${repository}/` : '/'

export default defineConfig({
  base,
  // Expose the development server on the local network so a phone can load
  // every Vite module and its HMR connection, not only the initial HTML page.
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: "Yam's Score",
        short_name: "Yam's",
        description: "Comptez facilement les points de votre partie de Yam's.",
        theme_color: '#111418',
        background_color: '#111418',
        display: 'standalone',
        lang: 'fr',
        icons: [
          { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }
        ]
      }
    })
  ]
})
