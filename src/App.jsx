import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useMarketData } from './hooks/useMarketData';

// Lazy load heavy components to prevent blocking
const Header = ({ onExportPDF, lastUpdate }) => {
  const { lang, setLang, t } = useLanguage();
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      background: 'linear-gradient(to right, #1a1f3a, #242d4a)',
      borderBottom: '1px solid #3a4458',
      padding: '16px 24px',
      zIndex: 40,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(to right, #00d4aa, #00a878)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          MarketSync Pro
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#a8b2c7', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
            {t.live} {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: '#242d4a', border: '1px solid #3a4458', color: '#f5f7fa', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
            <option value="FR">🇫🇷 FR</option>
            <option value="EN">🇬🇧 EN</option>
          </select>
          <button onClick={onExportPDF} style={{ background: '#00d4aa', color: '#0a0e27', fontWeight: 'bold', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
            {t.exportPdf}
          </button>
        </div>
      </div>
    </header>
  );
};

function AppContent() {
  const [step, setStep] = useState(1);
  const { t } = useLanguage();
  const reportRef = useRef();
  const [lastUpdate] = useState(new Date());

  // Try loading market data
  const { data: etfData, loading, error } = useMarketData();

  const exportPDF = async () => {
    try {
      if (!reportRef.current) return;
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`MarketSync-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error('PDF error:', e);
      alert('PDF export failed: ' + e.message);
    }
  };

  return (
    <div style={{ background: '#0a0e27', minHeight: '100vh', color: '#f5f7fa' }}>
      <Header onExportPDF={exportPDF} lastUpdate={lastUpdate} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{
          background: '#1a1f3a',
          border: '1px solid #3a4458',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#00d4aa', marginBottom: '16px' }}>
            ✅ MarketSync Pro
          </h1>
          <p style={{ fontSize: '18px', color: '#a8b2c7', marginBottom: '24px' }}>
            App is rendering successfully!
          </p>
          <p style={{ color: '#a8b2c7', marginBottom: '12px' }}>
            Current Step: <span style={{ color: '#00d4aa', fontWeight: 'bold' }}>{step}/3</span>
          </p>

          {loading && <p style={{ color: '#00d4aa', marginBottom: '16px' }}>📊 Loading market data...</p>}
          {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>❌ Error: {error}</p>}
          {!loading && !error && (
            <p style={{ color: '#10b981', marginBottom: '16px' }}>
              ✅ Market data loaded! ({Object.keys(etfData).length} ETFs)
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {[1, 2, 3].map(s => (
              <button
                key={s}
                onClick={() => setStep(s)}
                style={{
                  background: step === s ? '#00d4aa' : '#242d4a',
                  color: step === s ? '#0a0e27' : '#f5f7fa',
                  padding: '10px 20px',
                  border: '1px solid #3a4458',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                Step {s}
              </button>
            ))}
          </div>

          <p style={{ color: '#a8b2c7', marginTop: '32px', fontSize: '12px' }}>
            🎉 If you see this, ErrorBoundary is working and React is rendering properly
          </p>
          <p style={{ color: '#a8b2c7', fontSize: '12px' }}>
            🔍 Check browser console for any JavaScript errors
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
