import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useMarketData } from './hooks/useMarketData';
import { useDCASimulator } from './hooks/useDCASimulator';
import { Navbar } from './components/layout/Navbar';
import { PipelineStatusBar } from './components/layout/PipelineStatusBar';
import { StepMarket } from './components/steps/StepMarket';
import { StepAnalysis } from './components/steps/StepAnalysis';
import { StepDecision } from './components/steps/StepDecision';
import { Documentation } from './components/steps/Documentation';

function AppContent() {
  const [step, setStep] = useState(1);
  const [selectedETF, setSelectedETF] = useState('SPY');
  const [dcaAmount, setDcaAmount] = useState(200);
  const [dcaStart, setDcaStart] = useState('2023-01-01');
  const [dcaEnd, setDcaEnd] = useState('2024-12-31');
  const { t } = useLanguage();
  const reportRef = useRef();

  // Try loading market data
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

  return (
    <div style={{ background: '#0a0e27', minHeight: '100vh', color: '#f5f7fa' }}>
      <Navbar currentStep={step} setStep={setStep} onExportPDF={exportPDF} />

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
            />
          </div>
        )}

        {!loading && !error && step === 2 && (
          <div style={{ padding: '0 24px' }}>
            <StepAnalysis
              etfData={etfData}
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
            />
          </div>
        )}

        {step === 4 && (
          <Documentation />
        )}
      </main>

      <PipelineStatusBar isLive={isLive} avgLatency={avgLatency} lastUpdate={lastUpdate} />
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
