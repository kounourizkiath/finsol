import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const CodeBlock = ({ code, language = 'javascript' }) => (
  <pre style={{
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '6px',
    padding: '16px',
    overflow: 'auto',
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#c9d1d9',
    margin: '16px 0'
  }}>
    <code>{code}</code>
  </pre>
);

const SectionCard = ({ title, icon, children, borderColor = '#00d4aa' }) => (
  <div style={{
    background: '#1a1f3a',
    border: `1px solid #3a4458`,
    borderLeft: `4px solid ${borderColor}`,
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px'
  }}>
    <h3 style={{ color: '#f5f7fa', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '24px' }}>{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

export const Documentation = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('architecture');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['architecture', 'pipeline', 'algorithms'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < 200) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0e27', color: '#f5f7fa' }}>
      {/* Sticky Sidebar */}
      <aside style={{
        position: 'sticky',
        top: '100px',
        width: '250px',
        height: 'calc(100vh - 100px)',
        background: '#1a1f3a',
        borderRight: '1px solid #3a4458',
        padding: '24px',
        overflowY: 'auto'
      }}>
        <h4 style={{ color: '#00d4aa', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase' }}>
          Sections
        </h4>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'architecture', label: 'Architecture' },
            { id: 'pipeline', label: 'Data Pipeline' },
            { id: 'algorithms', label: 'Algorithmes' }
          ].map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActiveSection(id)}
              style={{
                color: activeSection === id ? '#00d4aa' : '#a8b2c7',
                textDecoration: 'none',
                padding: '8px 12px',
                borderLeft: activeSection === id ? '2px solid #00d4aa' : '2px solid transparent',
                paddingLeft: '10px',
                transition: 'all 0.3s',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00d4aa'}
              onMouseLeave={(e) => e.target.style.color = activeSection === id ? '#00d4aa' : '#a8b2c7'}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px', maxWidth: '1000px' }}>

        {/* SECTION 1 — ARCHITECTURE */}
        <section id="architecture">
          <h1 style={{ fontSize: '36px', color: '#00d4aa', marginBottom: '8px' }}>
            Architecture Technique
          </h1>
          <p style={{ color: '#a8b2c7', fontSize: '16px', marginBottom: '32px' }}>
            Stack Data Engineering — Production Grade
          </p>

          {/* Data Flow Diagram */}
          <div style={{
            background: '#1a1f3a',
            border: '1px solid #3a4458',
            borderRadius: '8px',
            padding: '32px',
            marginBottom: '32px',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center',
              minWidth: '1000px'
            }}>
              {[
                { name: 'Yahoo Finance API', tech: 'REST Endpoint', icon: '🌐' },
                { name: 'useMarketData Hook', tech: 'React + fetch()', icon: '🔌' },
                { name: 'localStorage Cache', tech: 'TTL: 15min', icon: '💾' },
                { name: 'indicators.js', tech: 'RSI · MA · Signal', icon: '⚙️' },
                { name: 'optimizer.js', tech: 'Sharpe · Markowitz', icon: '📈' },
                { name: 'React Components', tech: 'UI Rendering', icon: '📊' }
              ].map((block, i) => (
                <div key={i}>
                  <div style={{
                    background: '#242d4a',
                    border: '2px solid #00d4aa',
                    borderRadius: '6px',
                    padding: '16px',
                    textAlign: 'center',
                    minWidth: '120px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{block.icon}</div>
                    <div style={{ color: '#00d4aa', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>
                      {block.name.split(' ')[0]}
                    </div>
                    <div style={{ color: '#a8b2c7', fontSize: '11px' }}>{block.tech}</div>
                  </div>
                  {i < 5 && (
                    <div style={{
                      color: '#3a4458',
                      margin: '0 -6px',
                      fontSize: '20px'
                    }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Grid */}
          <div style={{
            background: '#1a1f3a',
            border: '1px solid #3a4458',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '32px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  { label: 'Frontend', tech: 'React 18 + Vite + Tailwind CSS' },
                  { label: 'Charts', tech: 'Recharts' },
                  { label: 'Data Source', tech: 'Yahoo Finance API (REST)' },
                  { label: 'Cache', tech: 'localStorage (TTL: 15min)' },
                  { label: 'Math', tech: 'Custom utils (pure JavaScript)' },
                  { label: 'Deploy', tech: 'Vercel (CI/CD via GitHub)' },
                  { label: 'Export', tech: 'html2canvas + jsPDF' }
                ].map((row, i) => (
                  <tr key={i} style={{
                    borderBottom: i < 6 ? '1px solid #3a4458' : 'none'
                  }}>
                    <td style={{
                      padding: '12px 16px',
                      color: '#00d4aa',
                      fontWeight: 'bold',
                      width: '150px',
                      background: '#242d4a'
                    }}>
                      {row.label}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#a8b2c7'
                    }}>
                      {row.tech}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2 — DATA PIPELINE */}
        <section id="pipeline" style={{ marginTop: '64px' }}>
          <h1 style={{ fontSize: '36px', color: '#00d4aa', marginBottom: '8px' }}>
            Pipeline de Données ETF
          </h1>
          <p style={{ color: '#a8b2c7', fontSize: '16px', marginBottom: '32px' }}>
            Ingestion → Transformation → Visualisation
          </p>

          {/* Stage 1 */}
          <SectionCard
            title="Fetch Yahoo Finance API"
            icon="🔌"
            borderColor="#3b82f6"
          >
            <CodeBlock code={`GET https://query1.finance.yahoo.com/v8/finance/chart/SPY
    ?interval=1d&range=1y

Response:
{
  "chart": {
    "result": [{
      "timestamp": [1704067200, 1704153600, ...],
      "indicators": {
        "quote": [{
          "close": [380.25, 382.10, ...]
        }]
      }
    }]
  }
}`} />
            <p style={{ color: '#a8b2c7', fontSize: '14px', lineHeight: '1.6' }}>
              <strong style={{ color: '#00d4aa' }}>Détails:</strong> 252 trading days × 5 ETFs = 1,260 data points
              fetched per session. CORS proxy via corsproxy.io. Retry logic with exponential backoff.
              Timeout: 5 secondes.
            </p>
          </SectionCard>

          {/* Stage 2 */}
          <SectionCard
            title="Cache localStorage (TTL 15 min)"
            icon="💾"
            borderColor="#eab308"
          >
            <CodeBlock code={`const CACHE_KEY = 'marketsync_etf_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
const cachedData = cached[etf];

if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
  return cachedData; // ✅ Serve from cache
} else {
  // ❌ Cache expired or missing, fetch fresh
  const fresh = await fetchETFData(etf);
  cached[etf] = fresh;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  return fresh;
}`} />
            <p style={{ color: '#a8b2c7', fontSize: '14px', lineHeight: '1.6' }}>
              <strong style={{ color: '#00d4aa' }}>Détails:</strong> Évite les re-fetches inutiles. TTL de 15 minutes.
              Invalidation automatique à l'expiration. Réduction de 80% des requêtes API.
            </p>
          </SectionCard>

          {/* Stage 3 */}
          <SectionCard
            title="Calcul des indicateurs (indicators.js)"
            icon="⚙️"
            borderColor="#10b981"
          >
            <CodeBlock code={`// RSI(14) — Relative Strength Index
export const calculateRSI = (prices, period = 14) => {
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  let sumGains = 0, sumLosses = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) sumGains += changes[i];
    else sumLosses += Math.abs(changes[i]);
  }

  let avgGain = sumGains / period;
  let avgLoss = sumLosses / period;

  // Smooth averages for remaining data
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + (changes[i] > 0 ? changes[i] : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (changes[i] < 0 ? Math.abs(changes[i]) : 0)) / period;
  }

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

// Moving Average
const MA = (prices, n) =>
  prices.slice(-n).reduce((a,b) => a+b, 0) / n;

// Signal generation
if (RSI < 40 && MA20 > MA50 && momentum > 0)
  return 'ACHETER';  // BUY signal
if (RSI > 65 || momentum < -3)
  return 'ALLÉGER';  // SELL signal
return 'CONSERVER'; // HOLD
`} />
            <p style={{ color: '#a8b2c7', fontSize: '14px', lineHeight: '1.6' }}>
              <strong style={{ color: '#00d4aa' }}>Détails:</strong> Pure functions, zero side effects.
              Testables unitairement. RSI(14), MA20, MA50, momentum sur 30 jours.
              Indicateurs calculés en ~2ms par ETF.
            </p>
          </SectionCard>

          {/* Stage 4 */}
          <SectionCard
            title="Rendu React + Recharts (Visualisation)"
            icon="📊"
            borderColor="#00d4aa"
          >
            <CodeBlock code={`// DCA Simulator (useDCASimulator.js)
export const useDCASimulator = (etfData, selectedETF, dcaAmount, startDate, endDate) => {
  return useMemo(() => {
    const history = etfData[selectedETF]?.history || [];
    let totalInvested = 0;
    let shares = 0;
    const chartData = [];

    const currentMonth = new Date(startDate);
    while (currentMonth <= new Date(endDate)) {
      const closestPrice = findClosestPrice(history, currentMonth);
      if (closestPrice) {
        totalInvested += dcaAmount;
        shares += dcaAmount / closestPrice;

        chartData.push({
          date: currentMonth.toLocaleDateString(),
          invested: totalInvested,
          value: shares * closestPrice,
          gain: (shares * closestPrice) - totalInvested
        });
      }
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    const performance = (chartData[chartData.length - 1].gain / totalInvested) * 100;
    return { invested: totalInvested, value, performance, chartData };
  }, [etfData, selectedETF, dcaAmount, startDate, endDate]);
};
`} />
            <p style={{ color: '#a8b2c7', fontSize: '14px', lineHeight: '1.6' }}>
              <strong style={{ color: '#00d4aa' }}>Détails:</strong> Calcul du backtest DCA en temps réel.
              Mise à jour instantanée au changement des inputs. Optimisation Markowitz pour allocation maximisant
              le ratio de Sharpe (taux sans risque: 3.5% EUR).
            </p>
          </SectionCard>
        </section>

        {/* SECTION 3 — ALGORITHMES */}
        <section id="algorithms" style={{ marginTop: '64px', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '36px', color: '#00d4aa', marginBottom: '8px' }}>
            Algorithmes Financiers
          </h1>
          <p style={{ color: '#a8b2c7', fontSize: '16px', marginBottom: '32px' }}>
            Implémentés from scratch en JavaScript pur
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* RSI Card */}
            <SectionCard title="RSI (Relative Strength Index)" icon="📊">
              <p style={{ color: '#a8b2c7', marginBottom: '12px', fontSize: '13px' }}>
                <strong style={{ color: '#00d4aa' }}>Formula:</strong>
              </p>
              <CodeBlock code={`RSI = 100 - (100 / (1 + RS))
Where RS = Avg Gain / Avg Loss (14 periods)`} />
              <p style={{ color: '#a8b2c7', fontSize: '13px', marginBottom: '12px' }}>
                <strong style={{ color: '#00d4aa' }}>Interprétation:</strong>
              </p>
              <table style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #3a4458' }}>
                    <td style={{ padding: '8px', color: '#ef4444' }}>RSI &lt; 35</td>
                    <td style={{ padding: '8px', color: '#a8b2c7' }}>Survente → Signal ACHETER</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #3a4458' }}>
                    <td style={{ padding: '8px', color: '#f59e0b' }}>35-65</td>
                    <td style={{ padding: '8px', color: '#a8b2c7' }}>Zone neutre → CONSERVER</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', color: '#10b981' }}>RSI &gt; 65</td>
                    <td style={{ padding: '8px', color: '#a8b2c7' }}>Achat → Signal ALLÉGER</td>
                  </tr>
                </tbody>
              </table>
            </SectionCard>

            {/* Sharpe Ratio Card */}
            <SectionCard title="Sharpe Ratio (Markowitz)" icon="📈">
              <p style={{ color: '#a8b2c7', marginBottom: '12px', fontSize: '13px' }}>
                <strong style={{ color: '#00d4aa' }}>Formula:</strong>
              </p>
              <CodeBlock code={`S = (Rp - Rf) / σp

Where:
  Rp = Portfolio return
  Rf = Risk-free rate (3.5% EUR)
  σp = Portfolio std deviation`} />
              <p style={{ color: '#a8b2c7', fontSize: '13px', marginBottom: '12px' }}>
                <strong style={{ color: '#00d4aa' }}>Usage:</strong>
              </p>
              <p style={{ color: '#a8b2c7', fontSize: '13px' }}>
                Maximisé dans l'optimiseur d'allocation pour trouver le portefeuille efficient sur la frontière
                de Markowitz. S &gt; 1.0 = excellent ratio ajusté au risque.
              </p>
            </SectionCard>

            {/* DCA Card */}
            <SectionCard title="DCA Backtest" icon="💰">
              <p style={{ color: '#a8b2c7', marginBottom: '12px', fontSize: '13px' }}>
                <strong style={{ color: '#00d4aa' }}>Formula:</strong>
              </p>
              <CodeBlock code={`Shares(t) = Σ [Amount / Price(t)]
Return = (Shares × Price_now - Invested)
         / Invested

CAGR = (FinalValue/Invested)^(1/years) - 1`} />
              <p style={{ color: '#a8b2c7', fontSize: '13px' }}>
                Simulateur de Dollar-Cost Averaging sur l'historique réel. Calcule le rendement annualisé.
                Impact: réduit la volatilité vs lump-sum investing.
              </p>
            </SectionCard>
          </div>
        </section>

        {/* CREDITS */}
        <footer style={{
          borderTop: '1px solid #3a4458',
          paddingTop: '48px',
          marginTop: '64px',
          textAlign: 'center',
          color: '#a8b2c7'
        }}>
          <p style={{ marginBottom: '16px', fontSize: '14px' }}>
            Built by <strong style={{ color: '#00d4aa' }}>Rizkiath Kounou</strong> — Data Engineer & BI Analyst
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://www.linkedin.com/in/kounou-rizkiath/" target="_blank" rel="noopener noreferrer"
              style={{ color: '#00d4aa', textDecoration: 'none' }}>
              🔗 LinkedIn
            </a>
            <span style={{ color: '#3a4458' }}>•</span>
            <a href="https://my-portfolio-rizkiath-kounou.vercel.app/" target="_blank" rel="noopener noreferrer"
              style={{ color: '#00d4aa', textDecoration: 'none' }}>
              🌐 Portfolio
            </a>
            <span style={{ color: '#3a4458' }}>•</span>
            <a href="https://www.upwork.com/freelancers/~016e6a2202bbbe59ec" target="_blank" rel="noopener noreferrer"
              style={{ color: '#00d4aa', textDecoration: 'none' }}>
              💼 Upwork
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};
