# Media Risk Intelligence Platform

A sophisticated regulatory intelligence platform that analyzes company exposure to identity and regulatory risks by scanning multiple government data sources in real-time. The system provides early warning signals for potential regulatory actions, enforcement proceedings, and compliance risks.

## 🚀 Features

### Real-Time Investigation Feed
- **Live typewriter effect**: Character-by-character feed display with color-coded line types
- **Sequential processing**: Each operation logged with timestamps and visual indicators
- **Professional terminal experience**: Bloomberg-style multi-ring spinner with pulsing active dots
- **Auto-scrolling**: Feed automatically follows active investigation progress

### Multi-Source Data Collection
- **Congressional Bills & Proceedings** (Congress.gov API)
- **FTC Enforcement Actions** (Consumer Protection)
- **FCC Proceedings** (Media & Content Regulation)
- **Senate Lobbying Disclosures** (LDA Filings)
- **Federal Register** (Regulatory Proposals)
- **NewsAPI** (Media Coverage & Public Signals)

### AI-Powered Analysis
- **Claude API Integration**: Advanced natural language processing for risk assessment
- **Risk Scoring**: Automated severity levels (Critical/High/Moderate/Low)
- **Velocity Tracking**: Multiplier calculations across 30/90/180-day windows
- **Strategic Recommendations**: Actionable intelligence briefs

### Comprehensive Risk Dashboard
- **Risk Momentum Panel**: Visual velocity indicators with trend analysis
- **Regulatory Exposure Map**: Interactive heatmap visualization
- **Pipeline Tracking**: Legislative vs Enforcement track monitoring
- **Competitor Intelligence**: Industry-wide risk correlation analysis

## 🎯 Target Users

- **Compliance Officers**: Regulatory monitoring and reporting
- **Legal Teams**: Risk assessment and litigation preparation
- **Executive Leadership**: Strategic decision-making support
- **Investment Analysts**: Due diligence and risk modeling

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern component-based architecture
- **Vite**: Fast development build tool
- **Custom Styling**: Professional dark theme with inline CSS
- **GLSL Hills**: GPU-accelerated background effects

### Backend Services
- **Intelligence Engine**: Orchestration layer for parallel data collection
- **Claude Analysis**: AI-powered risk assessment and synthesis
- **Modular Service Architecture**: Individual API integration modules

### APIs & Data Sources
- Congress.gov, FCC ECFS, NewsAPI, Federal Register, Senate LDA, FTC RSS

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/gowthamunity-maker/media-risk-intelligence.git
   cd media-risk-intel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

## 🔑 API Configuration

### Required API Keys
Create a `.env` file with the following variables:

```env
# Congress.gov API - Bill tracking
VITE_CONGRESS_GOV_API_KEY=your_api_key_here

# FCC ECFS API - Proceedings monitoring
VITE_FCC_API_KEY=your_api_key_here

# NewsAPI - Regulatory news coverage
VITE_NEWS_API_KEY=your_api_key_here

# Anthropic Claude API - AI analysis
VITE_ANTHROPIC_API_KEY=your_api_key_here

# Optional: LegiScan API - State legislation
VITE_LEGISCAN_API_KEY=your_api_key_here
```

### API Key Setup
- **Congress.gov**: Register at [api.congress.gov](https://api.congress.gov/)
- **FCC ECFS**: Apply for API access at [fcc.gov](https://www.fcc.gov/)
- **NewsAPI**: Get key at [newsapi.org](https://newsapi.org/)
- **Claude API**: Configure at [anthropic.com](https://anthropic.com/)

## 📊 Usage

### Quick Start
1. Enter a company name (e.g., "Netflix", "JPMorgan Chase", "TikTok")
2. Click "Generate Identity Risk Brief →"
3. Watch the real-time investigation feed
4. Review comprehensive risk analysis results

### Supported Companies
- **Tech/Media**: Netflix, Spotify, TikTok, Disney, Comcast, YouTube
- **Financial**: JPMorgan Chase, Bank of America, Wells Fargo, Citigroup, Goldman Sachs
- **Custom**: Any company with regulatory presence

### Risk Analysis Results
- **Overall Risk Level**: Critical/High/Moderate/Low
- **Velocity Multiplier**: Signal acceleration rate
- **Regulatory Window**: Time-to-impact predictions
- **Specific Risks**: Detailed regulatory exposure points
- **Strategic Actions**: Prioritized recommendations

## 🏗️ Architecture

### Data Flow
1. **Signal Collection**: Parallel API calls to 6 government sources
2. **Data Normalization**: Standardized format processing
3. **Velocity Analysis**: Time-window trend calculations
4. **AI Synthesis**: Claude API for risk assessment
5. **Report Generation**: Comprehensive intelligence brief

### Service Modules
- `intelligenceEngine.js` - Orchestration layer
- `claudeAnalysis.js` - AI-powered analysis
- `congressGov.js` - Congressional data
- `fcc.js` - Media regulation
- `ftcFeed.js` - Enforcement tracking
- `senateLDA.js` - Lobbying disclosures
- `federalRegister.js` - Regulatory proposals
- `newsService.js` - Media signals

## 🎨 UI Components

### Investigation Feed
- **Typewriter Effect**: Character-by-character message display
- **Color Coding**: Gold (agent), Teal (data), Blue (analysis), Green (complete)
- **Active Indicators**: Pulsing dots show current operation
- **Auto-scroll**: Smooth following of active investigation

### Risk Dashboard
- **Risk Momentum Panel**: Velocity visualization with trend arrows
- **Regulatory Heatmap**: Domain-specific risk scoring
- **Pipeline Tracking**: Legislative vs enforcement progress
- **Competitor Analysis**: Industry correlation insights

## 🔧 Development

### Project Structure
```
src/
├── components/
│   └── GLSLHills.jsx          # GPU background effects
├── services/
│   ├── claudeAnalysis.js     # AI analysis layer
│   ├── intelligenceEngine.js  # Data orchestration
│   ├── congressGov.js         # Congressional API
│   ├── fcc.js                 # FCC API
│   ├── ftcFeed.js             # FTC RSS feed
│   ├── senateLDA.js           # Senate lobbying
│   ├── federalRegister.js     # Federal Register API
│   └── newsService.js         # NewsAPI integration
├── App.jsx                    # Main application
├── App.css                    # Application styles
└── main.jsx                   # Entry point
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🚀 Deployment

### Environment Setup
1. Set all required environment variables
2. Configure API keys for production
3. Ensure CORS settings for API endpoints

### Build Process
```bash
npm run build
npm run preview
```

### Production Considerations
- **API Rate Limits**: Monitor usage across all services
- **Error Handling**: Graceful degradation for API failures
- **Caching**: Implement response caching for performance
- **Security**: Validate all API responses and inputs

## 📈 Performance

### Response Times
- **Data Collection**: 10-15 seconds (parallel API calls)
- **AI Analysis**: 15-25 seconds (Claude API processing)
- **Total Analysis**: 25-40 seconds typical
- **UI Performance**: 60fps animations with GPU acceleration

### Optimization Features
- **Parallel API Calls**: All 6 sources queried simultaneously
- **Progressive Loading**: Real-time feed shows progress
- **GPU Acceleration**: GLSL shaders for background effects
- **Efficient State Management**: Optimized React hooks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with proper testing
4. Submit pull request with description

### Code Standards
- **ESLint**: Follow configured linting rules
- **Component Structure**: Maintain consistent patterns
- **API Integration**: Proper error handling and timeouts
- **Documentation**: Update README and inline comments

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

### Common Issues
- **API Key Errors**: Verify all keys in `.env` file
- **Rate Limiting**: Check API quota limits
- **Network Issues**: Ensure stable internet connection
- **Browser Compatibility**: Use modern browser (Chrome, Firefox, Safari)

### Debug Information
- **Console Logs**: Check browser dev tools for errors
- **Network Tab**: Monitor API call responses
- **Environment**: Verify `.env` variables are loaded

---

**Media Risk Intelligence Platform** - Early detection of regulatory risks through advanced AI analysis and real-time government data monitoring.
