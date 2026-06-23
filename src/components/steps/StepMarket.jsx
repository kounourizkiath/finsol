import { KPICard } from '../cards/KPICard';
import { ETFCard } from '../cards/ETFCard';
import { PerformanceChart } from '../charts/PerformanceChart';

export const StepMarket = ({ etfData, selectedETF, setSelectedETF, onNext, onPrevious, labels }) => {
  const kpis = [
    {
      label: labels.bestPerf,
      value: Math.max(...Object.values(etfData).map(d => d.change || 0)).toFixed(1) + '%',
    },
    {
      label: labels.worstPerf,
      value: Math.min(...Object.values(etfData).map(d => d.change || 0)).toFixed(1) + '%',
    },
    {
      label: labels.avgVolatility,
      value: '12.4%',
    },
    {
      label: labels.avgCorrelation,
      value: '0.68',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard key={i} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.keys(etfData).map(etf => (
          <ETFCard
            key={etf}
            etf={etf}
            data={etfData[etf]}
            selected={selectedETF === etf}
            onClick={() => setSelectedETF(etf)}
          />
        ))}
      </div>

      {etfData[selectedETF] && (
        <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#f5f7fa] mb-4">{selectedETF} - 1 Year</h3>
          <PerformanceChart data={etfData[selectedETF]} />
        </div>
      )}

      <div className="flex justify-between">
        <div></div>
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition"
        >
          {labels.next} →
        </button>
      </div>
    </div>
  );
};
