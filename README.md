# MarketSync Pro — Professional ETF Analytics Platform

**A professional-grade financial analytics tool** demonstrating real Data Engineering + portfolio optimization skills.

Live: https://finsol.vercel.app

---

## 🎯 What It Does

MarketSync Pro is a **3-step decision support system** that helps users analyze ETFs and make better investment decisions:

1. **Étape 1 — Marché (Market)**: Live ETF data from Yahoo Finance with performance charts
2. **Étape 2 — Analyse (Analysis)**: Automated trading signals (Buy/Hold/Sell) + correlation analysis  
3. **Étape 3 — Décision (Decision)**: DCA simulator + portfolio optimizer (Markowitz efficient frontier)

---

## 📊 Features

### Live Market Data
- Real-time ETF prices via Yahoo Finance API
- 5 major ETFs: URTH, SPY, QQQ, GLD, ^FCHI
- Historical 1Y data with 252 trading days
- Pipeline status showing latency & data points processed

### Automated Signals
- **RSI(14)** — Overbought/oversold detection
- **Moving Average Crossover** — Trend identification (MA20 vs MA50)
- **Momentum** — 1-month performance indicator
- Conviction scoring (confidence level)

### DCA Simulator
- Monthly/weekly/lump-sum investment strategies
- Custom ETF + amount + date range
- Live performance calculation:
  - Total invested
  - Final portfolio value
  - % return + annualized return
  - Best/worst month analysis
- Area chart showing invested vs portfolio value

### Portfolio Optimizer
- Efficient frontier visualization (risk vs return scatter plot)
- Markowitz optimal allocation calculation
- Suggested rebalancing with buy/sell recommendations
- Diversification scoring

### Professional UX
- **3-step progress bar** — Clear user journey
- **Onboarding modal** — First-visit walkthrough (localStorage)
- **Dark theme** — Bloomberg-style (#0a0e27, accent #00d4aa)
- **Smooth animations** — Count-up numbers, chart transitions
- **Responsive design** — Mobile, tablet, desktop
- **FR/EN language toggle**
- **PDF export** — Full report generation

---

## 🏗️ Tech Stack

- **React 18** — Component-based UI
- **Vite** — Lightning-fast build
- **Recharts** — Professional charts (line, area, scatter, bar)
- **Tailwind CSS** — Styling (inline classes for simplicity)
- **Yahoo Finance API** — Free, public endpoints (no backend needed)
- **html2canvas + jsPDF** — PDF report generation
- **localStorage** — User preferences persistence

---

## 📈 Data Engineering Story

This app demonstrates **real data pipeline thinking**:

```
Yahoo Finance API
  ↓
Fetch 5 ETFs × 252 days = 1,260 data points
  ↓
Client-side ETL:
  • Parse OHLC data
  • Calculate 252 close prices
  • Compute RSI, MA, momentum
  • Correlation matrix
  • DCA backtest
  ↓
Visualization Layer
  ↓
Live dashboard + PDF export
```

**Footer shows pipeline metrics:**
- Data source (Yahoo Finance)
- Last ingestion time
- API latency (312ms)
- Total data points processed

---

## 🚀 Deployment

### Local Development
```bash
npm install
npm run dev
# Opens http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates /dist folder
npm run preview
```

### Vercel Deployment
Simply push to GitHub — Vercel auto-detects `package.json` and deploys:
```bash
git push origin main
# Vercel builds and deploys automatically
```

---

## 📱 Mobile Responsive

- Cards stack vertically on mobile
- Charts resize intelligently  
- Touch-friendly buttons
- Readable on all screen sizes

---

## 🔒 Privacy & Data

- **No backend server** — All calculations client-side
- **Public APIs only** — Yahoo Finance has no authentication
- **No user tracking** — Just localStorage for preferences
- **No data storage** — Everything is ephemeral

---

## 💼 Why This Matters

### For Investors
- **Actually useful** — Not just pretty dashboards; real decision support
- **Free & live** — Yahoo Finance data updated daily
- **Educational** — Understand RSI, moving averages, portfolio theory
- **Simulator** — Test DCA strategies before investing

### For Hiring Managers / Clients
- **Data pipeline visualization** — Shows ETL thinking
- **API integration** — Live data fetching & parsing
- **Financial knowledge** — RSI, correlation, Sharpe ratio, efficient frontier
- **UX design** — 3-step flow, onboarding, responsive
- **Production-ready** — Works on Vercel, mobile-friendly, PDF export

---

## 📊 Metrics Calculated

| Metric | Purpose |
|--------|---------|
| **RSI(14)** | Momentum oscillator (0-100) |
| **MA20 / MA50** | Trend direction identification |
| **Momentum** | 1-month performance |
| **Correlation** | Asset diversification quality |
| **DCA Performance** | Dollar-cost averaging backtest |
| **Sharpe Ratio** | Risk-adjusted return (calculated for optimal portfolio) |
| **Concentration** | Diversification risk (top 3 holdings %) |
| **Volatility** | Historical std deviation (annual) |

---

## 🎨 Design System

**Color Scheme (Dark Theme):**
- Background: `#0a0e27` (navy)
- Secondary: `#1a1f3a` (slate)
- Tertiary: `#242d4a` (dark slate)
- Border: `#3a4458` (muted)
- Text primary: `#f5f7fa` (light)
- Text secondary: `#a8b2c7` (muted)
- **Accent: `#00d4aa` (teal gradient)**

**Components:**
- KPI cards with hover lift
- Signal badges (green/yellow/red)
- Charts with gradients & animations
- Skeleton loaders (loading states)
- Sticky header with live status badge

---

## 🔄 Future Enhancements

- Real-time WebSocket for minute-level updates
- Database storage for historical analysis
- User authentication + multi-portfolio support  
- Advanced backtesting engine
- Machine learning signal generation
- Options chain analysis
- Integration with brokers (Alpaca, IB, etc.)

---

## 📞 About

Built by **KOUNOU RIZKIATH**  
📧 kounourizkiath@gmail.com  
📱 +33 (0)7 80 10 96 31

This is a **portfolio project** demonstrating:
- Data engineering (API + ETL)
- Full-stack React development  
- Financial analysis & portfolio theory
- Professional UI/UX design
- Production deployment

---

**MarketSync Pro: Make informed ETF investment decisions with live data, automated signals, and portfolio optimization.** 🚀
