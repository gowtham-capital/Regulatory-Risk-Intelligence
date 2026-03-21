// Runtime configuration - API keys will be set at runtime
export const config = {
  // These will be set by environment variables at runtime
  // For GitHub Pages deployment, these should be set via GitHub Secrets
  congressGovApiKey: null,
  fccApiKey: null,
  newsApiKey: null,
  anthropicApiKey: null,
  legiscanApiKey: null,
  
  // Initialize from environment variables (only available in development)
  init() {
    if (typeof window !== 'undefined' && window.ENV) {
      this.congressGovApiKey = window.ENV.VITE_CONGRESS_GOV_API_KEY;
      this.fccApiKey = window.ENV.VITE_FCC_API_KEY;
      this.newsApiKey = window.ENV.VITE_NEWS_API_KEY;
      this.anthropicApiKey = window.ENV.VITE_ANTHROPIC_API_KEY;
      this.legiscanApiKey = window.ENV.VITE_LEGISCAN_API_KEY;
      
      console.log('Config initialized with API keys:', {
        congress: !!this.congressGovApiKey,
        fcc: !!this.fccApiKey,
        news: !!this.newsApiKey,
        anthropic: !!this.anthropicApiKey,
        legiscan: !!this.legiscanApiKey
      });
    } else {
      console.warn('No window.ENV found - API keys not loaded');
    }
  }
};

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  config.init();
}
