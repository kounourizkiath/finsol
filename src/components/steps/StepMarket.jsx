import { useState, useEffect } from 'react';
import { KPICard } from '../cards/KPICard';
import { ETFCard } from '../cards/ETFCard';
import { PerformanceChart } from '../charts/PerformanceChart';
import { calcVolatility, calcAverageCorrelation } from '../../utils/indicators';

export const StepMarket = ({ etfData, selectedETF, setSelectedETF, onNext, onPrevious, labels }) => {
  const [animatedKPIs, setAnimatedKPIs] = useState({});

  // Animate KPI numbers on mount
  useEffect(() => {
    if (Object.keys(etfData).length === 0) return;

    const changes = Object.values(etfData).map(d => d.change || 0);
    const bestPerf = Math.max(...changes);
    const worstPerf = Math.min(...changes);

    const priceArrays = Object.values(etfData).map(d => d.history?.map(h => h.price) || []);
    const avgVol = calcVolatility(priceArrays[0] || []) * 100;
    const avgCorr = calcAverageCorrelation(priceArrays);

    // Simulate count-up animation
    let frame = 0;
    const interval = setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / 20);

      setAnimatedKPIs({
        best: (bestPerf * progress).toFixed(1),
        worst: (worstPerf * progress).toFixed(1),
        vol: (avgVol * progress).toFixed(1),
        corr: (avgCorr * progress).toFixed(2),
      });

      if (progress === 1) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [etfData]);

  const kpis = [
    {
      label: labels.bestPerf,
      value: `${animatedKPIs.best || 0}%`,
      color: '#10b981',
    },
    {
      label: labels.worstPerf,
      value: `${animatedKPIs.worst || 0}%`,
      color: '#ef4444',
    },
    {
      label: labels.avgVolatility,
      value: `${animatedKPIs.vol || 0}%`,
    },
    {
      label: labels.avgCorrelation,
      value: animatedKPIs.corr || '0.00',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard
            key={i}
            label={kpi.label}
            value={kpi.value}
            color={kpi.color}
          />
        ))}
      </div>

      {/* ETF Grid */}
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

      {/* Performance Chart */}
      {etfData[selectedETF] && (
        <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#f5f7fa] mb-4">
            {selectedETF} - 1 Year Performance
          </h3>
          <PerformanceChart data={etfData[selectedETF]} />
        </div>
      )}

      {/* Navigation */}
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
