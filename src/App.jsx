import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useMarketData } from './hooks/useMarketData';
import { useDCASimulator } from './hooks/useDCASimulator';
import { Navbar } from './components/layout/Navbar';
import { PipelineStatusBar } from './components/layout/PipelineStatusBar';
import { LandingPage } from './components/pages/LandingPage';
import { StepMarket } from './components/steps/StepMarket';
import { StepAnalysis } from './components/steps/StepAnalysis';
import { StepDecision } from './components/steps/StepDecision';
import { Documentation } from './components/steps/Documentation';

function AppContent() {
  const [activeSection, setActiveSection] = useState('accueil');
  const [selectedETF, setSelectedETF] = useState('SPY');
  const [dcaAmount, setDcaAmount] = useState(200);
  const [dcaStart, setDcaStart] = useState('2023-01-01');
  const [dcaEnd, setDcaEnd] = useState('2024-12-31');
  const { t } = useLanguage();
  const reportRef = useRef();

  // Market data
  const { data: etfData, loading, error, isLive, avgLatency, lastUpdate } = useMarketData();
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

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div style={{ background: '#0a0e27', minHeight: '100vh', color: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeSection={activeSection} onNavClick={handleNavClick} onExportPDF={exportPDF} isLive={isLive} />

      <main style={{ flex: 1, paddingBottom: activeSection !== 'accueil' ? '120px' : '0' }}>
        {/* LANDING */}
        {activeSection === 'accueil' && (
          <div style={{ animation: 'fadeInPage 0.3s ease-out' }}>
            <LandingPage onStartAnalysis={() => setActiveSection('marche')} />
          </div>
        )}

        {/* MARKET */}
        {activeSection === 'marche' && (
          <div style={{ animation: 'fadeInPage 0.3s ease-out', padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            {loading && <div style={{ textAlign: 'center', padding: '60px' }}><div style={{ width: '48px', height: '48px', border: '4px solid #3a4458', borderTop: '4px solid #00d4aa', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} /><p>Loading...</p></div>}
            {!loading && error && <div style={{ background: '#1a1f3a', border: '1px solid #ef4444', borderRadius: '8px', padding: '40px', textAlign: 'center' }}><p style={{ color: '#ef4444', fontWeight: 'bold' }}>Error: {error}</p></div>}
            {!loading && !error && <StepMarket etfData={etfData} selectedETF={selectedETF} setSelectedETF={setSelectedETF} />}
          </div>
        )}

        {/* ANALYSIS */}
        {activeSection === 'analyse' && (
          <div style={{ animation: 'fadeInPage 0.3s ease-out', padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            {!loading && !error && <StepAnalysis etfData={etfData} />}
          </div>
        )}

        {/* DECISION */}
        {activeSection === 'decision' && (
          <div style={{ animation: 'fadeInPage 0.3s ease-out', padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            {!loading && !error && <StepDecision etfData={etfData} selectedETF={selectedETF} setSelectedETF={setSelectedETF} dcaAmount={dcaAmount} setDcaAmount={setDcaAmount} dcaStart={dcaStart} setDcaStart={setDcaStart} dcaEnd={dcaEnd} setDcaEnd={setDcaEnd} dca={dca} onExportPDF={exportPDF} />}
          </div>
        )}

        {/* DOCS */}
        {activeSection === 'docs' && (
          <div style={{ animation: 'fadeInPage 0.3s ease-out' }}>
            <Documentation />
          </div>
        )}
      </main>

      {activeSection !== 'accueil' && <PipelineStatusBar isLive={isLive} avgLatency={avgLatency} lastUpdate={lastUpdate} />}

      <style>{`
        @keyframes fadeInPage { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
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
