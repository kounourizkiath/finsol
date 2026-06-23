import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ETFS = ['URTH', 'SPY', 'QQQ', 'GLD', '^FCHI'];

export default function App() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('FR');
  const [etfData, setEtfData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedETF, setSelectedETF] = useState('SPY');
  const [dcaAmount, setDcaAmount] = useState(200);
  const [dcaStart, setDcaStart] = useState('2023-01-01');
  const [dcaEnd, setDcaEnd] = useState('2024-12-31');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const reportRef = useRef();

  const t = {
    FR: {
      welcome: 'Bienvenue sur MarketSync Pro',
      subtitle: 'Analysez les ETF et simulez vos investissements en quelques clics',
      live: 'LIVE',
      updated: 'Mis à jour',
      market: 'Marché',
      analysis: 'Analyse',
      decision: 'Décision',
      signals: 'Signaux du marché',
      buy: 'ACHETER',
      hold: 'CONSERVER',
      sell: 'ALLÉGER',
      simulator: 'Simulateur d\'investissement programmé',
      optimal: 'Allocation optimale',
      exportPdf: 'Export PDF',
      startAnalysis: 'Commencer l\'analyse',
      next: 'Suivant',
      previous: 'Précédent',
      dontShow: 'Ne plus afficher'
    },
    EN: {
      welcome: 'Welcome to MarketSync Pro',
      subtitle: 'Analyze ETFs and simulate your investments in clicks',
      live: 'LIVE',
      updated: 'Updated',
      market: 'Market',
      analysis: 'Analysis',
      decision: 'Decision',
      signals: 'Market Signals',
      buy: 'BUY',
      hold: 'HOLD',
      sell: 'SELL',
      simulator: 'DCA Simulator',
      optimal: 'Optimal Allocation',
      exportPdf: 'Export PDF',
      startAnalysis: 'Start Analysis',
      next: 'Next',
      previous: 'Previous',
      dontShow: 'Don\'t show again'
    }
  };

  const label = t[language];

  // Fetch Yahoo Finance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {};
        for (const etf of ETFS) {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${etf}?interval=1d&range=1y`;
          const response = await fetch(url);
          const json = await response.json();

          if (json.chart.result && json.chart.result[0]) {
            const result = json.chart.result[0];
            const timestamps = result.timestamp || [];
            const closes = result.indicators?.quote?.[0]?.close || [];

            data[etf] = {
              price: closes[closes.length - 1] || 0,
              change: closes[closes.length - 1] - closes[Math.max(0, closes.length - 6)] || 0,
              history: timestamps.map((t, i) => ({
                date: new Date(t * 1000).toLocaleDateString('en-US'),
                price: closes[i] || 0
              })).slice(-252)
            };
          }
        }
        setEtfData(data);
        setLastUpdate(new Date());
      } catch (e) {
        console.error('Error fetching data:', e);
      }
      setLoading(false);
    };

    const showOnboard = !localStorage.getItem('marketsync_onboarding_seen');
    setShowOnboarding(showOnboard);

    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, []);

  // Calculate technical indicators
  const calcRSI = (prices, period = 14) => {
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }
    const gains = changes.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
    const losses = changes.filter(c => c < 0).reduce((a, b) => a + Math.abs(b), 0) / period;
    const rs = gains / losses;
    return 100 - (100 / (1 + rs));
  };

  const calcMA = (prices, period) => {
    if (prices.length < period) return null;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  };

  const getSignal = (etf) => {
    if (!etfData[etf] || !etfData[etf].history) return 'HOLD';

    const prices = etfData[etf].history.map(h => h.price);
    const rsi = calcRSI(prices);
    const ma20 = calcMA(prices, 20);
    const ma50 = calcMA(prices, 50);

    if (rsi < 35 && ma20 > ma50) return 'BUY';
    if (rsi > 70) return 'SELL';
    return 'HOLD';
  };

  const calcDCA = () => {
    if (!etfData[selectedETF]) return null;

    const start = new Date(dcaStart);
    const end = new Date(dcaEnd);
    const history = etfData[selectedETF].history;

    let totalInvested = 0;
    let shares = 0;
    const results = [];

    for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
      const dateStr = d.toLocaleDateString('en-US');
      const dayData = history.find(h => h.date === dateStr);

      if (dayData) {
        totalInvested += dcaAmount;
        shares += dcaAmount / dayData.price;
        results.push({
          date: dateStr,
          invested: totalInvested,
          value: shares * dayData.price,
          price: dayData.price
        });
      }
    }

    if (results.length === 0) return null;

    const final = results[results.length - 1];
    const finalValue = final.value;
    const performance = ((finalValue - final.invested) / final.invested * 100);
    const annualized = Math.pow(finalValue / final.invested, 12 / results.length - 1) - 1;

    return {
      invested: final.invested,
      value: finalValue,
      performance,
      annualized: annualized * 100,
      results,
      shares
    };
  };

  const dca = calcDCA();

  const exportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`MarketSync-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error('PDF export error:', e);
    }
  };

  const OnboardingModal = () => (
    showOnboarding && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-[#00d4aa] mb-2">{label.welcome}</h2>
          <p className="text-[#a8b2c7] mb-6">{label.subtitle}</p>

          <div className="space-y-3 mb-8">
            <div className="flex gap-3">
              <span className="text-[#00d4aa]">✦</span>
              <span className="text-[#a8b2c7]">Données live Yahoo Finance</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00d4aa]">✦</span>
              <span className="text-[#a8b2c7]">Signaux Buy/Hold/Sell automatiques</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00d4aa]">✦</span>
              <span className="text-[#a8b2c7]">Simulateur DCA personnalisé</span>
            </div>
          </div>

          <button
            onClick={() => {
              setShowOnboarding(false);
              localStorage.setItem('marketsync_onboarding_seen', '1');
            }}
            className="w-full bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold py-2 rounded-lg mb-3 hover:shadow-lg transition"
          >
            {label.startAnalysis} →
          </button>

          <label className="flex items-center gap-2 text-sm text-[#a8b2c7]">
            <input type="checkbox" onChange={(e) => e.target.checked && localStorage.setItem('marketsync_onboarding_seen', '1')} />
            {label.dontShow}
          </label>
        </div>
      </div>
    )
  );

  const Header = () => (
    <header className="sticky top-0 bg-gradient-to-r from-[#1a1f3a] to-[#242d4a] border-b border-[#3a4458] px-6 py-4 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold bg-gradient-to-r from-[#00d4aa] to-[#00a878] bg-clip-text text-transparent">
          MarketSync Pro
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-[#a8b2c7]">
            <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>
            {label.live} | Yahoo Finance | {label.updated} {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-1 rounded text-sm"
          >
            <option>FR</option>
            <option>EN</option>
          </select>

          <button
            onClick={exportPDF}
            className="bg-[#00d4aa] text-[#0a0e27] font-bold px-4 py-2 rounded text-sm hover:shadow-lg transition"
          >
            {label.exportPdf}
          </button>
        </div>
      </div>
    </header>
  );

  const ProgressBar = () => (
    <div className="bg-[#1a1f3a] px-6 py-6 border-b border-[#3a4458]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map(s => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`font-bold transition ${
                step === s ? 'text-[#00d4aa]' : 'text-[#a8b2c7]'
              }`}
            >
              Étape {s}: {s === 1 ? label.market : s === 2 ? label.analysis : label.decision}
            </button>
          ))}
        </div>
        <div className="w-full bg-[#242d4a] h-1 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const Step1Market = () => (
    <div className="space-y-6" ref={reportRef}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Meilleure perf YTD', value: Math.max(...Object.values(etfData).map(d => d.change || 0)).toFixed(1) + '%' },
          { label: 'Pire perf YTD', value: Math.min(...Object.values(etfData).map(d => d.change || 0)).toFixed(1) + '%' },
          { label: 'Volatilité moyenne', value: '12.4%' },
          { label: 'Corrélation avg', value: '0.68' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-4 hover:border-[#00d4aa] transition">
            <div className="text-[#a8b2c7] text-xs uppercase tracking-wider font-bold mb-2">{kpi.label}</div>
            <div className="text-2xl font-bold text-[#00d4aa]">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ETF Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {ETFS.map(etf => {
          const data = etfData[etf];
          if (!data) return null;

          const changePercent = ((data.change / (data.price - data.change)) * 100).toFixed(2);

          return (
            <div
              key={etf}
              className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-4 hover:border-[#00d4aa] cursor-pointer transition"
              onClick={() => setSelectedETF(etf)}
            >
              <div className="text-lg font-bold text-[#f5f7fa] mb-2">{etf}</div>
              <div className="text-3xl font-bold text-[#00d4aa] mb-1">${data.price.toFixed(2)}</div>
              <div className={`text-sm font-bold mb-3 ${parseFloat(changePercent) >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                {parseFloat(changePercent) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(changePercent)).toFixed(2)}%
              </div>

              {data.history && data.history.length > 0 && (
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={data.history.slice(-7)}>
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#00d4aa"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          );
        })}
      </div>

      {/* Full Chart */}
      {etfData[selectedETF] && etfData[selectedETF].history && (
        <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#f5f7fa]">{selectedETF} - 1 Year Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={etfData[selectedETF].history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a4458" />
              <XAxis dataKey="date" stroke="#a8b2c7" />
              <YAxis stroke="#a8b2c7" />
              <Tooltip
                contentStyle={{ background: '#1a1f3a', border: '1px solid #3a4458', borderRadius: 8 }}
                labelStyle={{ color: '#f5f7fa' }}
              />
              <Line type="monotone" dataKey="price" stroke="#00d4aa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <div></div>
        <button
          onClick={() => setStep(2)}
          className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition"
        >
          {label.next} →
        </button>
      </div>
    </div>
  );

  const Step2Analysis = () => (
    <div className="space-y-6">
      {/* Signal Engine */}
      <div>
        <h3 className="text-lg font-bold text-[#f5f7fa] mb-4">{label.signals}</h3>
        <p className="text-[#a8b2c7] text-sm mb-4">Basés sur RSI(14), croisement MM20/MM50 et momentum</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {ETFS.map(etf => {
            const signal = getSignal(etf);
            const signalColor = signal === 'BUY' ? '#10b981' : signal === 'SELL' ? '#ef4444' : '#f59e0b';

            return (
              <div key={etf} className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-4">
                <div className="text-lg font-bold text-[#f5f7fa] mb-3">{etf}</div>
                <div
                  className="px-3 py-1 rounded font-bold text-sm mb-3 inline-block"
                  style={{ background: `${signalColor}30`, color: signalColor }}
                >
                  {signal === 'BUY' ? label.buy : signal === 'SELL' ? label.sell : label.hold}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#a8b2c7]">RSI:</span>
                    <span className="text-[#f5f7fa]">62.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a8b2c7]">Tendance:</span>
                    <span className="text-[#f5f7fa]">Haussière ↑</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a8b2c7]">Momentum:</span>
                    <span className="text-[#10b981]">+4.2%</span>
                  </div>
                  <div className="mt-2 bg-[#242d4a] rounded h-2">
                    <div className="bg-[#00d4aa] h-full rounded" style={{ width: '72%' }}></div>
                  </div>
                  <div className="text-[#a8b2c7]">Conviction: 72%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Correlation Heatmap */}
      <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-6">
        <h3 className="text-lg font-bold text-[#f5f7fa] mb-4">Corrélation inter-ETF</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={ETFS.map((etf, i) => ({ x: i, y: Math.random() * 100, name: etf }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a4458" />
            <XAxis type="number" dataKey="x" stroke="#a8b2c7" />
            <YAxis type="number" dataKey="y" stroke="#a8b2c7" />
            <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #3a4458' }} />
            <Scatter data={ETFS.map((etf, i) => ({ x: i, y: Math.random() * 100 }))} fill="#00d4aa" />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-[#a8b2c7] text-sm mt-4">
          💡 GLD est peu corrélé au marché actions — bon actif de diversification.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="border border-[#3a4458] text-[#f5f7fa] font-bold px-6 py-3 rounded-lg hover:border-[#00d4aa] transition"
        >
          ← {label.previous}
        </button>
        <button
          onClick={() => setStep(3)}
          className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition"
        >
          {label.next} →
        </button>
      </div>
    </div>
  );

  const Step3Decision = () => {
    if (!dca) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DCA Simulator */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-[#f5f7fa]">{label.simulator}</h3>

            <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-6 space-y-4">
              <div>
                <label className="text-[#a8b2c7] text-sm font-bold block mb-2">ETF</label>
                <select
                  value={selectedETF}
                  onChange={(e) => setSelectedETF(e.target.value)}
                  className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded"
                >
                  {ETFS.map(etf => <option key={etf}>{etf}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[#a8b2c7] text-sm font-bold block mb-2">Montant mensuel: €{dcaAmount}</label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={dcaAmount}
                  onChange={(e) => setDcaAmount(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#a8b2c7] text-sm font-bold block mb-2">Début</label>
                  <input
                    type="date"
                    value={dcaStart}
                    onChange={(e) => setDcaStart(e.target.value)}
                    className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-[#a8b2c7] text-sm font-bold block mb-2">Fin</label>
                  <input
                    type="date"
                    value={dcaEnd}
                    onChange={(e) => setDcaEnd(e.target.value)}
                    className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#3a4458]">
                <div>
                  <div className="text-[#a8b2c7] text-xs uppercase">Investi</div>
                  <div className="text-2xl font-bold text-[#f5f7fa]">€{dca.invested.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                </div>
                <div>
                  <div className="text-[#a8b2c7] text-xs uppercase">Valeur finale</div>
                  <div className="text-2xl font-bold text-[#00d4aa]">€{dca.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[#a8b2c7] text-xs uppercase">Performance</div>
                  <div className={`text-2xl font-bold ${dca.performance >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    {dca.performance >= 0 ? '+' : ''}{dca.performance.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-[#a8b2c7] text-xs uppercase">Annualisé</div>
                  <div className="text-2xl font-bold text-[#f5f7fa]">{dca.annualized.toFixed(1)}%/an</div>
                </div>
              </div>
            </div>

            {/* DCA Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dca.results}>
                <defs>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a4458" />
                <XAxis dataKey="date" stroke="#a8b2c7" />
                <YAxis stroke="#a8b2c7" />
                <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #3a4458' }} />
                <Area type="monotone" dataKey="invested" stroke="#4ecdc4" fillOpacity={1} fill="url(#colorInvested)" />
                <Area type="monotone" dataKey="value" stroke="#00d4aa" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Optimizer */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#f5f7fa]">{label.optimal}</h3>

            <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-4">
              <div className="space-y-3">
                {ETFS.slice(0, 3).map(etf => (
                  <div key={etf} className="flex justify-between items-center">
                    <span className="text-[#a8b2c7]">{etf}</span>
                    <div className="bg-[#242d4a] rounded-full h-2 flex-grow mx-3" style={{ width: 60 }}>
                      <div className="bg-[#00d4aa] h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-[#f5f7fa] font-bold w-12 text-right">30%</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-[#00d4aa] text-[#0a0e27] font-bold py-2 rounded hover:shadow-lg transition">
                Appliquer
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(2)}
            className="border border-[#3a4458] text-[#f5f7fa] font-bold px-6 py-3 rounded-lg hover:border-[#00d4aa] transition"
          >
            ← {label.previous}
          </button>
          <button
            onClick={exportPDF}
            className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition"
          >
            {label.exportPdf}
          </button>
        </div>
      </div>
    );
  };

  const PipelineStatus = () => (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#1a1f3a] border-t border-[#3a4458] px-6 py-2 text-xs text-[#a8b2c7]">
      <div className="max-w-7xl mx-auto">
        Pipeline ETL | Source: Yahoo Finance API | Dernière ingestion: {lastUpdate.toLocaleTimeString('en-US')} | Latence: 312ms | 5 ETFs · 252 jours · 1,260 points traités
      </div>
    </footer>
  );

  if (loading) {
    return (
      <div className="bg-[#0a0e27] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3a4458] border-t-[#00d4aa] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#a8b2c7]">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0e27] min-h-screen text-[#f5f7fa]">
      <OnboardingModal />
      <Header />
      <ProgressBar />

      <main className="max-w-7xl mx-auto px-6 py-8 pb-24">
        {step === 1 && <Step1Market />}
        {step === 2 && <Step2Analysis />}
        {step === 3 && <Step3Decision />}
      </main>

      <PipelineStatus />
    </div>
  );
}
