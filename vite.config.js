import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Proxy config — prevents CORS errors when calling government APIs
    // Each entry routes /api/[name] to the real API base URL
    // This means in service files we call '/api/congress/...'
    // instead of 'https://api.congress.gov/...'
    proxy: {
      '/api/congress': {
        target: 'https://api.congress.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/congress/, '')
      },
      '/api/federalregister': {
        target: 'https://www.federalregister.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/federalregister/, '')
      },
      '/api/fcc': {
        target: 'https://publicapi.fcc.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fcc/, '')
      },
      '/api/lda': {
        target: 'https://lda.senate.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lda/, '')
      },
      '/api/ftc': {
        target: 'https://www.ftc.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ftc/, '')
      },
      '/api/news': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, '')
      },
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, '')
      }
    }
  }
})
