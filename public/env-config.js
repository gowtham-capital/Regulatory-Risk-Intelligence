// Runtime environment configuration for GitHub Pages
// This script will be executed during the build process to inject API keys

// Environment variables will be injected by GitHub Actions
window.ENV = {
  VITE_CONGRESS_GOV_API_KEY: process.env.VITE_CONGRESS_GOV_API_KEY || '',
  VITE_FCC_API_KEY: process.env.VITE_FCC_API_KEY || '',
  VITE_NEWS_API_KEY: process.env.VITE_NEWS_API_KEY || '',
  VITE_ANTHROPIC_API_KEY: process.env.VITE_ANTHROPIC_API_KEY || '',
  VITE_LEGISCAN_API_KEY: process.env.VITE_LEGISCAN_API_KEY || ''
};

// For GitHub Pages deployment, we need to inject the API keys at build time
// This script will be replaced during the GitHub Actions build process
