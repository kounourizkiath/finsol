import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { Header } from './components/layout/Header';
import { PipelineStatusBar } from './components/layout/PipelineStatusBar';
import { StepProgress } from './components/ui/StepProgress';
import { OnboardingModal } from './components/ui/OnboardingModal';

import { StepMarket } from './components/steps/StepMarket';
import { StepAnalysis } from './components/steps/StepAnalysis';
import { StepDecision } from './components/steps/StepDecision';

import { useMarketData } from './hooks/useMarketData';
import { useDCASimulator } from './hooks/useDCASimulator';
import { useLanguage } from './context/LanguageContext';
import { LanguageProvider } from './context/LanguageContext';

function AppContent() {
  // State management
  const [step, setStep] = useState(1);
  const [selectedETF, setSelectedETF] = useState('SPY');
  const [dcaAmount, setDcaAmount] = useState(200);
  const [dcaStart, setDcaStart] = useState('2023-01-01');
  const [dcaEnd, setDcaEnd] = useState('2024-12-31');
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('marketsync_onboarding_seen'));

  // Language hook
  const { t } = useLanguage();

  // Data hooks
  const { data: etfData, loading, lastUpdate } = useMarketData();
  const dca = useDCASimulator(etfData, selectedETF, dcaAmount, dcaStart, dcaEnd);

  const reportRef = useRef();

  // PDF Export
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

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#0a0e27] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3a4458] border-t-[#00d4aa] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#a8b2c7]">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0e27] min-h-screen text-[#f5f7fa]">
      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        labels={labels}
      />

      <Header
        onExportPDF={exportPDF}
        lastUpdate={lastUpdate}
      />

      <StepProgress currentStep={step} setCurrentStep={setStep} />

      <main className="max-w-7xl mx-auto px-6 py-8 pb-24" ref={reportRef}>
        <div className="transition-opacity duration-500 ease-out" style={{ opacity: 1 }}>
          {step === 1 && (
            <div className="animate-fadeInUp">
              <StepMarket
                etfData={etfData}
                selectedETF={selectedETF}
                setSelectedETF={setSelectedETF}
                onNext={() => setStep(2)}
                onPrevious={() => setStep(0)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeInUp">
              <StepAnalysis
                etfData={etfData}
                onNext={() => setStep(3)}
                onPrevious={() => setStep(1)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeInUp">
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
        </div>
      </main>

      <PipelineStatusBar lastUpdate={lastUpdate} />
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
