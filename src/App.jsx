import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useMarketData } from './hooks/useMarketData';
import { useDCASimulator } from './hooks/useDCASimulator';
import { StepMarket } from './components/steps/StepMarket';
import { StepAnalysis } from './components/steps/StepAnalysis';
import { StepDecision } from './components/steps/StepDecision';
import { Documentation } from './components/steps/Documentation';

// Lazy load heavy components to prevent blocking
const Header = ({ onExportPDF, lastUpdate, currentStep, setStep }) => {
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
        <div style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(to right, #00d4aa, #00a878)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }} onClick={() => setStep(1)}>
          MarketSync Pro
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#a8b2c7', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
            {currentStep !== 4 && t.live} {currentStep !== 4 && lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: '#242d4a', border: '1px solid #3a4458', color: '#f5f7fa', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
            <option value="FR">🇫🇷 FR</option>
            <option value="EN">🇬🇧 EN</option>
          </select>
          {currentStep !== 4 && (
            <button onClick={onExportPDF} style={{ background: '#00d4aa', color: '#0a0e27', fontWeight: 'bold', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
              {t.exportPdf}
            </button>
          )}
          <button
            onClick={() => setStep(currentStep === 4 ? 1 : 4)}
            style={{
              background: currentStep === 4 ? '#00d4aa' : '#3a4458',
              color: currentStep === 4 ? '#0a0e27' : '#f5f7fa',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = currentStep === 4 ? '#00c299' : '#4a5568'}
            onMouseLeave={(e) => e.target.style.background = currentStep === 4 ? '#00d4aa' : '#3a4458'}
          >
            📚 Docs
          </button>
        </div>
      </div>
    </header>
  );
};

function AppContent() {
  const [step, setStep] = useState(1);
  const [selectedETF, setSelectedETF] = useState('SPY');
  const [dcaAmount, setDcaAmount] = useState(200);
  const [dcaStart, setDcaStart] = useState('2023-01-01');
  const [dcaEnd, setDcaEnd] = useState('2024-12-31');
  const { t } = useLanguage();
  const reportRef = useRef();
  const [lastUpdate] = useState(new Date());

  // Try loading market data
  const { data: etfData, loading, error } = useMarketData();
  const dca = useDCASimulator(etfData, selectedETF, dcaAmount, dcaStart, dcaEnd);

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
      <Header onExportPDF={exportPDF} lastUpdate={lastUpdate} currentStep={step} setStep={setStep} />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 0' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#a8b2c7' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #3a4458',
              borderTop: '4px solid #00d4aa',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading market data...</p>
          </div>
        )}

        {error && (
          <div style={{
            background: '#1a1f3a',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            margin: '24px'
          }}>
            <p style={{ color: '#ef4444', fontWeight: 'bold' }}>❌ Error loading data:</p>
            <p style={{ color: '#a8b2c7', marginTop: '12px' }}>{error}</p>
          </div>
        )}

        {!loading && !error && step === 1 && (
          <div style={{ padding: '0 24px' }}>
            <StepMarket
              etfData={etfData}
              selectedETF={selectedETF}
              setSelectedETF={setSelectedETF}
              onNext={() => setStep(2)}
              onPrevious={() => setStep(0)}
            />
          </div>
        )}

        {!loading && !error && step === 2 && (
          <div style={{ padding: '0 24px' }}>
            <StepAnalysis
              etfData={etfData}
              onNext={() => setStep(3)}
              onPrevious={() => setStep(1)}
            />
          </div>
        )}

        {!loading && !error && step === 3 && (
          <div style={{ padding: '0 24px' }}>
            <StepDecision
              etfData={etfData}
              selectedETF={selectedETF}
              setSelectedETF={setSelectedETF}
              dcaAmount={dcaAmount}
              setDcaAmount={setDcaAmount}
              dcaStart={dcaStart}
              setDcaStart={setDcaStart}
              dcaEnd={dcaEnd}
              setDcaEnd={setDcaEnd}
              dca={dca}
              onExportPDF={exportPDF}
              onNext={() => setStep(1)}
              onPrevious={() => setStep(2)}
            />
          </div>
        )}

        {step === 4 && (
          <Documentation onPrevious={() => setStep(3)} />
        )}
      </main>
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
