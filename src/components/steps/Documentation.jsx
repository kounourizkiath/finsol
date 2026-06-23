import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const TechLogo = ({ name, size = 32 }) => (
  <img
    src={`https://cdn.simpleicons.org/${name}`}
    alt={name}
    style={{ width: size, height: size, filter: 'brightness(0) invert(1)' }}
  />
);

const APILogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ stroke: '#00d4aa', fill: 'none', strokeWidth: 2 }}>
    <circle cx="16" cy="16" r="14" />
    <text x="16" y="20" textAnchor="middle" style={{ fill: '#00d4aa', fontSize: '10px', fontWeight: 'bold' }}>
      API
    </text>
  </svg>
);

const DatabaseLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ stroke: '#00d4aa', fill: 'none', strokeWidth: 2 }}>
    <ellipse cx="16" cy="8" rx="10" ry="5" />
    <line x1="6" y1="8" x2="6" y2="20" />
    <line x1="26" y1="8" x2="26" y2="20" />
    <ellipse cx="16" cy="20" rx="10" ry="5" />
  </svg>
);

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
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const PipelineNode = ({ logo, title, description, details }) => (
  <div style={{
    background: '#1a1f3a',
    border: '1px solid #3a4458',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    minWidth: '160px'
  }}>
    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
      {logo}
    </div>
    <div style={{ color: '#00d4aa', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
      {title}
    </div>
    <div style={{ color: '#a8b2c7', fontSize: '12px', lineHeight: '1.4', marginBottom: '8px' }}>
      {description}
    </div>
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {details.map(d => (
        <span key={d} style={{
          background: '#242d4a',
          color: '#a8b2c7',
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '3px'
        }}>
          {d}
        </span>
      ))}
    </div>
  </div>
);

const FormulaCard = ({ title, formula, where, interpretation }) => (
  <div style={{
    background: '#0d1117',
    border: '3px solid #00d4aa',
    borderLeft: '3px solid #00d4aa',
    borderRadius: '6px',
    padding: '24px',
    fontFamily: "'Courier New', monospace",
    marginBottom: '24px'
  }}>
    <div style={{ color: '#00d4aa', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>
      {title}
    </div>
    <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', lineHeight: '1.8' }}>
      {formula}
    </div>
    {where && (
      <div style={{ color: '#a8b2c7', fontSize: '13px', marginBottom: '16px', lineHeight: '1.8' }}>
        {where}
      </div>
    )}
    {interpretation && (
      <div style={{ color: '#10b981', fontSize: '13px', lineHeight: '1.8' }}>
        {interpretation}
      </div>
    )}
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
            { id: 'context', label: 'Contexte' },
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
      <main style={{ flex: 1, padding: '48px', maxWidth: '1200px' }}>

        {/* SECTION 0 — CONTEXTE & UTILITÉ */}
        <section id="context" style={{ marginBottom: '64px' }}>
          <h1 style={{ fontSize: '36px', color: '#00d4aa', marginBottom: '8px' }}>
            Contexte & Utilité
          </h1>
          <p style={{ color: '#a8b2c7', fontSize: '16px', marginBottom: '32px' }}>
            Pourquoi MarketSync Pro existe et comment il résout un vrai problème
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            {/* Left: Problem */}
            <div>
              <h2 style={{ color: '#f5f7fa', fontSize: '20px', marginBottom: '16px' }}>Pourquoi MarketSync Pro ?</h2>
              <p style={{ color: '#a8b2c7', lineHeight: '1.6', marginBottom: '20px' }}>
                Les investisseurs particuliers manquent d'outils accessibles pour analyser les ETF de manière empirique.
                Les plateformes existantes (Bloomberg, Refinitiv) sont coûteuses et complexes.
                <strong style={{ color: '#00d4aa' }}> MarketSync Pro démocratise l'analyse quantitative</strong>
                {' '}en combinant ingestion de données temps-réel, indicateurs techniques automatisés
                et simulation de stratégies d'investissement — le tout dans une interface web accessible.
              </p>
              {[
                { icon: '❌', title: 'Données fragmentées', desc: 'Les prix ETF, indicateurs et outils de simulation sont sur des plateformes différentes.' },
                { icon: '❌', title: 'Analyse manuelle chronophage', desc: 'Calculer RSI, MA et backtests DCA manuellement prend des heures.' },
                { icon: '❌', title: 'Coût des outils pro', desc: 'Bloomberg: $24,000/an. MarketSync Pro: open source.' }
              ].map((prob, i) => (
                <div key={i} style={{
                  background: '#242d4a',
                  border: '1px solid #ef4444',
                  borderLeft: '3px solid #ef4444',
                  borderRadius: '6px',
                  padding: '16px',
                  marginBottom: '12px'
                }}>
                  <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '4px' }}>
                    {prob.icon} {prob.title}
                  </div>
                  <div style={{ color: '#a8b2c7', fontSize: '13px' }}>{prob.desc}</div>
                </div>
              ))}
            </div>

            {/* Right: Solution */}
            <div>
              <h2 style={{ color: '#f5f7fa', fontSize: '20px', marginBottom: '16px' }}>La Solution</h2>
              <p style={{ color: '#a8b2c7', lineHeight: '1.6', marginBottom: '20px' }}>
                <strong style={{ color: '#00d4aa' }}>Une plateforme data-driven complète</strong>
                {' '}qui unifie l'ingestion, la transformation et la visualisation des données financières
                en un seul dashboard interactif et performant.
              </p>
              {[
                { icon: '✅', title: 'Pipeline automatisé', desc: '1 fetch = 1,260 points transformés en signaux en <500ms.' },
                { icon: '✅', title: 'Indicateurs temps-réel', desc: 'RSI(14), MA, momentum et Sharpe calculés automatiquement.' },
                { icon: '✅', title: 'Simulateur de décision', desc: 'Backtestez n\'importe quelle stratégie DCA sur l\'historique réel.' }
              ].map((sol, i) => (
                <div key={i} style={{
                  background: '#242d4a',
                  border: '1px solid #10b981',
                  borderLeft: '3px solid #10b981',
                  borderRadius: '6px',
                  padding: '16px',
                  marginBottom: '12px'
                }}>
                  <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                    {sol.icon} {sol.title}
                  </div>
                  <div style={{ color: '#a8b2c7', fontSize: '13px' }}>{sol.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases & Metrics */}
          <div style={{
            background: '#1a1f3a',
            border: '1px solid #3a4458',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h3 style={{ color: '#00d4aa', marginBottom: '16px' }}>Cas d'usage</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {['📈 Investisseur particulier ETF', '🏦 Analyste financier junior', '🎓 Étudiant en finance quantitative', '💼 Data Engineer (portfolio)'].map(use => (
                <div key={use} style={{
                  background: '#242d4a',
                  border: '1px solid #3a4458',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: '#a8b2c7'
                }}>
                  {use}
                </div>
              ))}
            </div>
            <h3 style={{ color: '#00d4aa', marginBottom: '12px' }}>Métriques</h3>
            <div style={{ color: '#a8b2c7', fontSize: '13px', lineHeight: '2' }}>
              ⚡ &lt;500ms | 🔄 15min cache | 📊 1,260 pts/session | 🧮 3 algos | 🌍 5 ETFs mondiaux | 📱 Responsive
            </div>
          </div>
        </section>

        {/* SECTION 1 — ARCHITECTURE */}
        <section id="architecture" style={{ marginBottom: '64px' }}>
          <h1 style={{ fontSize: '36px', color: '#00d4aa', marginBottom: '8px' }}>
            Architecture Technique
          </h1>
          <p style={{ color: '#a8b2c7', fontSize: '16px', marginBottom: '32px' }}>
            Stack Data Engineering — Production Grade
          </p>

          {/* Professional Pipeline Diagram */}
          <div style={{
            background: '#0a0e27',
            border: '1px solid #3a4458',
            borderRadius: '8px',
            padding: '32px',
            marginBottom: '32px',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'flex',
              gap: '0',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              minWidth: '1100px'
            }}>
              {[
                { logo: <APILogo />, title: 'Yahoo Finance', desc: 'REST API', details: ['5 ETFs', '1Y data', '1,260 pts'] },
                { logo: <TechLogo name="react" />, title: 'useMarketData', desc: 'Fetch + Cache', details: ['fetch()', 'Error handle'] },
                { logo: <DatabaseLogo />, title: 'localStorage', desc: 'Cache Layer', details: ['15min TTL', 'JSON'] },
                { logo: <TechLogo name="javascript" />, title: 'indicators.js', desc: 'Transform', details: ['RSI·MA', 'Signals'] },
                { logo: <TechLogo name="react" />, title: 'React UI', desc: 'Render', details: ['Recharts', '3 Views'] }
              ].map((node, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <PipelineNode
                    logo={node.logo}
                    title={node.title}
                    description={node.desc}
                    details={node.details}
                  />
                  {i < 4 && (
                    <div style={{
                      fontSize: '20px',
                      color: '#00d4aa',
                      marginTop: '60px',
                      fontWeight: 'bold'
                    }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data Volume Bar */}
          <div style={{
            background: '#1a1f3a',
            border: '1px solid #3a4458',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h3 style={{ color: '#a8b2c7', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase' }}>
              Volume traité par session
            </h3>
            {[
              { label: 'Yahoo API', value: 1260, max: 1260, color: '#00d4aa' },
              { label: 'After cache', value: 252, max: 1260, color: '#3b82f6' },
              { label: 'After transform', value: 5, max: 1260, color: '#10b981' },
              { label: 'Rendered views', value: 3, max: 1260, color: '#f59e0b' }
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#a8b2c7', fontSize: '13px' }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 'bold', fontSize: '12px' }}>{item.value} pts</span>
                </div>
                <div style={{ background: '#242d4a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    background: item.color,
                    height: '100%',
                    width: `${(item.value / item.max) * 100}%`,
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Grid */}
          <div style={{
            background: '#1a1f3a',
            border: '1px solid #3a4458',
            borderRadius: '8px',
            overflow: 'hidden'
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
            icon={<APILogo size={24} />}
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
            icon={<DatabaseLogo size={24} />}
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
            icon={<TechLogo name="javascript" size={24} />}
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
            icon={<TechLogo name="react" size={24} />}
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

          {/* RSI Card */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#f5f7fa', fontSize: '20px', marginBottom: '16px' }}>RSI (Relative Strength Index)</h2>
            <FormulaCard
              title="RSI = 100 − (100 / (1 + RS))"
              formula="où  RS  = Gain moyen / Perte moyenne"
              where={`      n  = 14 périodes (standard)\n      RS > 1  → tendance haussière`}
              interpretation={`Interprétation:\n RSI < 35  → Zone de survente → Signal ACHETER\n 35-65  → Zone neutre → CONSERVER\n RSI > 65  → Zone d'achat → Signal ALLÉGER`}
            />
          </div>

          {/* Sharpe Ratio Card */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#f5f7fa', fontSize: '20px', marginBottom: '16px' }}>Sharpe Ratio (Markowitz)</h2>
            <FormulaCard
              title="S = (Rp − Rf) / σp"
              formula="où  Rp  = Rendement du portefeuille\n    Rf = 3.5% (taux sans risque EUR)\n    σp = Écart-type des rendements"
              interpretation={`Performance:\n S > 1.0  → excellent ratio risque/rendement\n S > 2.0  → très performant\n S < 0.5  → risque non compensé`}
            />
            <p style={{ color: '#a8b2c7', marginTop: '16px', fontSize: '13px', lineHeight: '1.6' }}>
              <strong style={{ color: '#00d4aa' }}>Usage:</strong> Maximisé dans l'optimiseur d'allocation pour trouver
              le portefeuille efficient sur la frontière de Markowitz. Ratio clé pour la gestion d'actifs.
            </p>
          </div>

          {/* DCA/CAGR Card */}
          <div>
            <h2 style={{ color: '#f5f7fa', fontSize: '20px', marginBottom: '16px' }}>DCA Backtest & CAGR</h2>
            <FormulaCard
              title="CAGR = (Vf / Vi)^(1/n) − 1"
              formula="où  Vf  = Valeur finale du portefeuille\n    Vi = Capital total investi\n     n = Nombre d'années"
              interpretation={`Dollar-Cost Averaging:\nShares(t) = Σ [Montant / Prix(t)] → Parts totales\nReturn = (Shares × Prix_actuel − Investi) / Investi\n\nBénéfices DCA:\n • Réduit la volatilité vs investissement unique\n • Étale le risque temporel\n • Moins d'impact des pics de prix`}
            />
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
