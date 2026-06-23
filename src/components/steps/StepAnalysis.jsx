import { SignalCard } from '../cards/SignalCard';
import { CorrelationHeatmap } from '../charts/CorrelationHeatmap';
import { ETFS } from '../../constants/etfConfig';
import { useLanguage } from '../../context/LanguageContext';

export const StepAnalysis = ({ etfData, onNext, onPrevious }) => {
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

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="border border-[#3a4458] text-[#f5f7fa] font-bold px-6 py-3 rounded-lg hover:border-[#00d4aa] transition"
        >
          {t.prev}
        </button>
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
};
