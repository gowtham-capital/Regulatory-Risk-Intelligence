// Runtime environment loader for GitHub Pages
// This script will be executed before the main application
(function() {
  // For GitHub Pages, we need to inject environment variables at runtime
  // This script should be placed in the public directory and loaded first
  
  // Default empty environment
  window.ENV = {
    VITE_CONGRESS_GOV_API_KEY: '',
    VITE_FCC_API_KEY: '',
    VITE_NEWS_API_KEY: '',
    VITE_ANTHROPIC_API_KEY: '',
    VITE_LEGISCAN_API_KEY: ''
  };
  
  // Try to load from localStorage (for development)
  try {
    const storedKeys = localStorage.getItem('apiKeys');
    if (storedKeys) {
      const keys = JSON.parse(storedKeys);
      window.ENV = { ...window.ENV, ...keys };
    }
  } catch (e) {
    console.log('No stored API keys found');
  }
  
  // Log for debugging
  console.log('Environment loader initialized');
  console.log('Available API keys:', {
    congress: !!window.ENV.VITE_CONGRESS_GOV_API_KEY,
    fcc: !!window.ENV.VITE_FCC_API_KEY,
    news: !!window.ENV.VITE_NEWS_API_KEY,
    anthropic: !!window.ENV.VITE_ANTHROPIC_API_KEY,
    legiscan: !!window.ENV.VITE_LEGISCAN_API_KEY
  });
})();
