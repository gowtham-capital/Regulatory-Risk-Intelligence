# GitHub Pages Deployment Guide

This guide explains how to deploy the Media Risk Intelligence platform to GitHub Pages.

## 🚀 Automatic Deployment (Recommended)

### Prerequisites
1. **Repository Settings**: Enable GitHub Pages in your repository
2. **Environment Variables**: Configure API keys as repository secrets
3. **GitHub Actions**: Ensure actions are enabled for your repository

### Step 1: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Source: Select **GitHub Actions**
5. Save settings

### Step 2: Configure Environment Variables
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

```
VITE_CONGRESS_GOV_API_KEY=your_congress_gov_api_key
VITE_FCC_API_KEY=your_fcc_api_key
VITE_NEWS_API_KEY=your_news_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_LEGISCAN_API_KEY=your_legiscan_api_key
```

### Step 3: Trigger Deployment
1. Push any changes to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Monitor deployment in **Actions** tab
4. Once complete, your site will be available at:
   `https://gowthamunity-maker.github.io/media-risk-intelligence/`

## 🔧 Manual Deployment

### Option 1: Using Deploy Script
```bash
# Build and deploy in one command
npm run deploy
```

### Option 2: Manual Build and Deploy
```bash
# Build the project
npm run build

# Deploy to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

## 📁 Configuration Details

### Vite Configuration
The `vite.config.js` includes:
- **Base Path**: `/media-risk-intelligence/` for GitHub Pages
- **Build Optimization**: Manual chunks for better performance
- **Asset Management**: Optimized asset directory structure

### GitHub Actions Workflow
The `.github/workflows/deploy.yml` includes:
- **Automatic Triggers**: On push to main branch
- **Node.js Setup**: Uses Node.js 18 with npm caching
- **Environment Variables**: Secure API key injection
- **Build Process**: Optimized production build
- **Pages Deployment**: Automatic GitHub Pages deployment

### Package.json Scripts
```json
{
  "scripts": {
    "deploy": "npm run build && git add dist && git commit -m 'Deploy to GitHub Pages' && git subtree push --prefix dist origin gh-pages"
  }
}
```

## 🔐 Security Considerations

### API Keys
- **Never commit** `.env` files to the repository
- **Use GitHub Secrets** for production API keys
- **Environment Variables** are securely injected during build
- **No Exposure** in the built application

### Build Security
- **Source Maps**: Enabled for debugging (can be disabled for production)
- **Dependency Scanning**: GitHub Actions scans for vulnerabilities
- **Code Analysis**: ESLint and other tools ensure code quality

## 🌐 Accessing Your Site

### Primary URL
```
https://gowthamunity-maker.github.io/media-risk-intelligence/
```

### Custom Domain (Optional)
1. Go to **Settings** → **Pages**
2. Add custom domain in **Custom domain** section
3. Update DNS records as instructed
4. Update `base` path in `vite.config.js` if needed

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Fails
- **Check API Keys**: Ensure all environment variables are set
- **Node Version**: Make sure Node.js 18+ is used
- **Dependencies**: Run `npm ci` for clean install

#### 2. 404 Errors
- **Base Path**: Verify `base` path matches repository name
- **GitHub Pages**: Ensure Pages is enabled and configured
- **Branch**: Deploy from correct branch (main)

#### 3. API Errors
- **CORS Issues**: GitHub Pages may have different CORS behavior
- **Rate Limits**: Check API quota and rate limits
- **Environment Variables**: Verify secrets are correctly configured

#### 4. White Screen
- **Console Errors**: Check browser dev tools for errors
- **Asset Loading**: Verify assets are loading correctly
- **JavaScript Errors**: Check for runtime errors in console

### Debug Information
```bash
# Check build output
npm run build

# Preview locally
npm run preview

# Check GitHub Actions logs
# Go to Actions tab in GitHub repository
```

## 📊 Performance Optimization

### Build Optimization
- **Code Splitting**: Manual chunks for vendor and router code
- **Asset Compression**: Gzip compression enabled
- **Tree Shaking**: Unused code automatically removed
- **Minification**: CSS and JavaScript minification

### Runtime Performance
- **Lazy Loading**: Components load as needed
- **Caching**: Browser caching headers optimized
- **CDN**: GitHub Pages provides global CDN
- **HTTP/2**: Modern protocol support

## 🔄 CI/CD Pipeline

### Automatic Deployment Flow
1. **Push to Main**: Trigger GitHub Actions
2. **Environment Setup**: Install dependencies and configure
3. **Build Process**: Create optimized production build
4. **Deploy**: Push to GitHub Pages
5. **Availability**: Site becomes live automatically

### Branch Strategy
- **Main Branch**: Production deployment target
- **Feature Branches**: Development and testing
- **Pull Requests**: Preview builds available

## 📈 Monitoring

### GitHub Actions Monitoring
- **Build Status**: Real-time build progress
- **Error Logs**: Detailed error information
- **Performance Metrics**: Build time and success rate
- **Deployment History**: Track deployment changes

### Site Analytics
- **GitHub Pages Analytics**: Basic traffic statistics
- **Google Analytics**: Can be added for detailed insights
- **Performance Monitoring**: Core Web Vitals tracking

## 🚀 Advanced Configuration

### Custom Domain Setup
```javascript
// vite.config.js
export default defineConfig({
  base: '/', // Use root for custom domain
  // ... other config
})
```

### Environment-Specific Builds
```javascript
// vite.config.js
export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/media-risk-intelligence/' 
    : '/',
  // ... other config
})
```

### Progressive Web App (PWA)
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // PWA optimization
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js'
      }
    }
  }
})
```

## 📞 Support

### GitHub Support
- **GitHub Pages Documentation**: [docs.github.com/en/pages](https://docs.github.com/en/pages)
- **GitHub Actions Documentation**: [docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev/)

### Common Resources
- **GitHub Pages Status**: [www.githubstatus.com](https://www.githubstatus.com/)
- **API Documentation**: Check individual API provider docs
- **Community Forums**: GitHub Discussions and Stack Overflow

---

**GitHub Pages Deployment** - Your Media Risk Intelligence platform is now ready for automatic deployment to GitHub Pages with full CI/CD pipeline support.
