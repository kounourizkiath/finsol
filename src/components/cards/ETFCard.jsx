import { formatPrice, formatPercent } from '../../utils/formatters';
import { ETF_CONFIG } from '../../constants/etfConfig';

export const ETFCard = ({ etf, data, onClick, selected }) => {
  if (!data) return null;

  const config = ETF_CONFIG[etf];
  const isPositive = data.change >= 0;
  const sparklineData = data.history?.slice(-7) || [];

  // Calculate SVG sparkline
  const renderSparkline = () => {
    if (sparklineData.length === 0) return null;

    const minPrice = Math.min(...sparklineData.map(d => d.price));
    const maxPrice = Math.max(...sparklineData.map(d => d.price));
    const range = maxPrice - minPrice || 1;

    const points = sparklineData
      .map((d, i) => {
        const x = (i / (sparklineData.length - 1)) * 100;
        const y = 100 - ((d.price - minPrice) / range) * 100;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg viewBox="0 0 100 30" className="w-full h-8 mt-2">
        <polyline
          points={points}
          fill="none"
          stroke={config.color}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#1a1f3a] border rounded-lg p-4 cursor-pointer transition ${
        selected ? 'border-[#00d4aa] shadow-lg scale-105' : 'border-[#3a4458] hover:border-[#00d4aa]'
      }`}
    >
      <div>
        <div className="text-sm font-bold text-[#a8b2c7] uppercase tracking-wider">{etf}</div>
        <div className="text-xs text-[#a8b2c7] mb-2">{config.name}</div>
      </div>

      <div className="text-2xl font-bold text-[#f5f7fa] mb-1">
        {formatPrice(data.price)}
      </div>

      <div className={`text-sm font-bold mb-3 ${isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
        {isPositive ? '↑' : '↓'} {formatPercent(data.change)}
      </div>

      {renderSparkline()}

      {/* 1Y Performance Bar */}
      <div className="mt-3">
        <div className="text-xs text-[#a8b2c7] mb-1">1Y Performance</div>
        <div className="bg-[#242d4a] rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full ${isPositive ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}
            style={{ width: `${Math.min(100, Math.abs(data.change) * 5)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
