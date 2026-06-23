import { SignalCard } from '../cards/SignalCard';
import { CorrelationHeatmap } from '../charts/CorrelationHeatmap';
import { ETFS } from '../../constants/etfConfig';
import { useLanguage } from '../../context/LanguageContext';

export const StepAnalysis = ({ etfData }) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#f5f7fa] mb-2">{t.signals}</h3>
        <p className="text-[#a8b2c7] text-sm mb-4">{t.signalsSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {ETFS.map(etf => {
            const prices = etfData[etf]?.history?.map(h => h.price) || [];
            return <SignalCard key={etf} etf={etf} prices={prices} />;
          })}
        </div>
      </div>

      <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-6">
        <h3 className="text-lg font-bold text-[#f5f7fa] mb-4">Inter-ETF Correlation</h3>
        <CorrelationHeatmap />
        <p className="text-[#a8b2c7] text-sm mt-4">
          💡 GLD shows low correlation with equity markets — good diversification asset.
        </p>
      </div>

    </div>
  );
};
