# Regulatory Risk Intelligence

> **Early warning system that detects regulatory compliance threats months before they impact businesses**

---

## 🎯 What This Tool Does

Regulatory Risk Intelligence monitors government databases and regulatory sources to identify potential compliance risks before they become problems. It analyzes patterns in legislation, enforcement actions, and regulatory filings to provide businesses with early warnings about upcoming regulatory threats.

### Key Capabilities

- **🔍 Risk Detection**: Scans 6 government sources in real-time
- **📊 Predictive Analysis**: Identifies risks 6-12 months before impact
- **⚡ Velocity Tracking**: Monitors how quickly regulatory signals are accelerating
- **📋 Strategic Actions**: Provides specific mitigation recommendations
- **🖥️ Live Investigation Feed**: Professional terminal-style analysis visualization

---

## 👥 Who Uses This Tool

### Target Users

- **Compliance Officers**: Monitor regulatory changes affecting their industry
- **Legal Teams**: Track enforcement actions and legislative developments
- **Risk Managers**: Assess regulatory exposure and plan mitigation strategies
- **Corporate Executives**: Stay informed about regulatory risks to business operations
- **Consultants**: Provide regulatory intelligence to clients

### Industries Served

- **Financial Services**: Banks, fintech, insurance companies
- **Technology**: Software companies, social media platforms, tech startups
- **Media & Entertainment**: Content creators, streaming services, publishers
- **Healthcare**: Medical devices, pharmaceutical companies, health tech
- **Manufacturing**: Industrial companies facing environmental and safety regulations

---

## 🚀 How to Use This Tool

### Quick Start

1. **Enter a Company Name**: Type any company name (e.g., "Netflix", "JPMorgan Chase")
2. **Click "Generate Regulatory Risk Brief"**: Start the investigation
3. **Watch Live Analysis**: See the system investigate in real-time
4. **Review Results**: Get comprehensive risk assessment and strategic recommendations

### What You Get

#### **Risk Assessment**
- Overall risk level (LOW, MEDIUM, HIGH, CRITICAL)
- Velocity multiplier showing acceleration of regulatory signals
- Risk momentum indicator

#### **Regulatory Risks**
- Specific regulatory threats identified
- Severity levels and timeframes
- Source links for verification
- Legal references and statutes

#### **Strategic Actions**
- Immediate steps to take (next 30 days)
- Medium-term planning (90 days)
- Long-term strategy (6-12 months)
- Competitive analysis insights

---

## 🏗️ How It Works

### Data Sources

The system monitors 6 government sources continuously:

1. **Congressional Bills**: Active legislation and committee activity
2. **FTC Enforcement**: Consumer protection and compliance actions
3. **FCC Proceedings**: Media and communication regulations
4. **Senate Filings**: Lobbying disclosure records
5. **Federal Register**: Proposed rule changes and notices
6. **News Coverage**: Media sentiment and public attention

### Analysis Process

1. **Signal Collection**: Parallel API calls to all sources
2. **Pattern Recognition**: Identifies risk indicators and trends
3. **Velocity Analysis**: Calculates acceleration of regulatory signals
4. **AI Assessment**: Claude analyzes for strategic implications
5. **Risk Scoring**: Multi-factor evaluation of threat level
6. **Report Generation**: Comprehensive brief with actionable recommendations

### Risk Factors Analyzed

- **Compliance Violations**: Regulatory enforcement actions
- **Content Regulation**: Censorship and moderation requirements
- **Antitrust Concerns**: Competition and monopoly issues
- **Consumer Protection**: FTC actions and compliance failures
- **Financial Compliance**: AML/KYC and reporting requirements

---

## 💻 Installation & Setup

### Prerequisites

- Node.js 20.19+ (required for Vite 8.0+)
- npm or yarn package manager
- API keys for Claude and government data sources

### Quick Install

```bash
# Clone the repository
git clone https://github.com/gowtham-capital/Regulatory-Risk-Intelligence.git
cd Regulatory-Risk-Intelligence

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run the application
npm run dev
```

### Environment Setup

Create a `.env` file with your API keys:

```env
VITE_CLAUDE_API_KEY=your_claude_api_key
VITE_CONGRESS_GOV_API_KEY=your_congress_api_key
VITE_FCC_API_KEY=your_fcc_api_key
VITE_NEWS_API_KEY=your_news_api_key
VITE_ANTHROPIC_API_KEY=your_claude_api_key
VITE_LEGISCAN_API_KEY=your_legiscan_api_key
```

### **For GitHub Pages Deployment (Automatic)**

The GitHub Pages deployment automatically uses GitHub Secrets. To set up:

1. Go to your repository: https://github.com/gowtham-capital/Regulatory-Risk-Intelligence
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these repository secrets:
   - `VITE_CLAUDE_API_KEY`
   - `VITE_CONGRESS_GOV_API_KEY` 
   - `VITE_FCC_API_KEY`
   - `VITE_NEWS_API_KEY`
   - `VITE_ANTHROPIC_API_KEY`
   - `VITE_LEGISCAN_API_KEY`

The GitHub Actions workflow will automatically use these secrets for deployment.

---

## 🎨 Key Features

### Live Investigation Feed

Professional terminal-style visualization that shows:
- Real-time investigation progress
- Sequential data collection from all sources
- AI analysis in progress
- Final risk compilation

### Risk Dashboard

Comprehensive results display with:
- Overall risk assessment
- Regulatory risk heatmap
- Velocity and momentum indicators
- Strategic action recommendations

### Strategic Intelligence

Actionable recommendations including:
- Immediate compliance steps
- Risk mitigation strategies
- Competitive positioning insights
- Timeline for regulatory changes

---

## 📊 Business Value

### Early Warning System

- **6-12 month advance notice** of regulatory risks
- **Competitive advantage** through proactive compliance
- **Risk mitigation** before issues become crises
- **Strategic planning** based on regulatory trends

### Cost Savings

- **Avoid fines** through early compliance
- **Reduce legal costs** with proactive measures
- **Minimize business disruption** from regulatory changes
- **Optimize resource allocation** for compliance teams

### Decision Support

- **Data-driven insights** for executive decisions
- **Evidence-based risk assessment** for board reporting
- **Competitive intelligence** for strategic planning
- **Compliance roadmap** for operational teams

---

## 🚀 Deployment

### Production Setup

```bash
# Build for production
npm run build

# Deploy to your preferred hosting platform
# (Vercel, Netlify, AWS Amplify recommended)
```

### Environment Configuration

Production variables:
```env
VITE_CLAUDE_API_KEY=production_key
VITE_ENVIRONMENT=production
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Need Help?

- **Issues**: [GitHub Issues](https://github.com/gowtham-capital/Regulatory-Risk-Intelligence/issues)
- **Support**: support@regulatory-risk-intel.com

---

## 🌐 Share & Access

### **GitHub Repository**
- **Main Repository**: https://github.com/gowtham-capital/Regulatory-Risk-Intelligence
- **Live Demo**: https://gowtham-capital.github.io/Regulatory-Risk-Intelligence/ (available after GitHub Pages deployment)

### **Easy Sharing**
- **Clone**: `git clone https://github.com/gowtham-capital/Regulatory-Risk-Intelligence.git`
- **Fork**: Click "Fork" on GitHub to create your own copy
- **Star**: Click "⭐ Star" to show your support
- **Share**: Use the repository URL to share with colleagues

### **Quick Access**
- **View Source**: Browse the complete source code on GitHub
- **Read Documentation**: Comprehensive README with setup instructions
- **Download**: Download as ZIP file for offline use
- **Report Issues**: Use GitHub Issues for bug reports and feature requests

---

**Built for businesses that need to stay ahead of regulatory risks before they impact operations.**

> *"The regulatory risk exposure can be detected months in advance."*
