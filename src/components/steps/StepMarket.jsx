import { useState, useEffect } from 'react';
import { KPICard } from '../cards/KPICard';
import { ETFCard } from '../cards/ETFCard';
import { PerformanceChart } from '../charts/PerformanceChart';
import { calcVolatility, calcAverageCorrelation } from '../../utils/indicators';
import { useLanguage } from '../../context/LanguageContext';

export const StepMarket = ({ etfData, selectedETF, setSelectedETF, onNext, onPrevious }) => {
  const { t } = useLanguage();
  const [animatedKPIs, setAnimatedKPIs] = useState({});

  // Animate KPI numbers on mount
  useEffect(() => {
    if (Object.keys(etfData).length === 0) return;

    // Guard against empty or invalid data
    const changes = Object.values(etfData)
      .map(d => {
        if (!d || typeof d.change !== 'number') return 0;
        return isFinite(d.change) ? d.change : 0;
      })
      .filter(x => x !== null && x !== undefined);

    const bestPerf = changes.length > 0 ? Math.max(...changes) : 0;
    const worstPerf = changes.length > 0 ? Math.min(...changes) : 0;

    const priceArrays = Object.values(etfData)
      .map(d => {
        if (!d || !d.history || !Array.isArray(d.history)) return [];
        return d.history.map(h => h.price).filter(p => typeof p === 'number' && isFinite(p));
      })
      .filter(arr => arr.length > 0);

    const avgVol = priceArrays.length > 0 ? calcVolatility(priceArrays[0]) * 100 : 0;
    const avgCorr = priceArrays.length > 1 ? calcAverageCorrelation(priceArrays) : 0;

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
      label: t.bestPerf,
      value: `${animatedKPIs.best || 0}%`,
      color: '#10b981',
    },
    {
      label: t.worstPerf,
      value: `${animatedKPIs.worst || 0}%`,
      color: '#ef4444',
    },
    {
      label: t.avgVol,
      value: `${animatedKPIs.vol || 0}%`,
    },
    {
      label: t.avgCorr,
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
          {t.next}
        </button>
      </div>
    </div>
  );
};
