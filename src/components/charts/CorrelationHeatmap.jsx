import { useState } from 'react';
import { ETFS } from '../../constants/etfConfig';

const CORRELATIONS = {
  URTH: { URTH: 1.00, SPY: 0.92, QQQ: 0.85, GLD: 0.12, '^FCHI': 0.74 },
  SPY:  { URTH: 0.92, SPY: 1.00, QQQ: 0.89, GLD: 0.08, '^FCHI': 0.71 },
  QQQ:  { URTH: 0.85, SPY: 0.89, QQQ: 1.00, GLD: 0.05, '^FCHI': 0.65 },
  GLD:  { URTH: 0.12, SPY: 0.08, QQQ: 0.05, GLD: 1.00, '^FCHI': 0.15 },
  '^FCHI': { URTH: 0.74, SPY: 0.71, QQQ: 0.65, GLD: 0.15, '^FCHI': 1.00 },
};

const getCorrelationColor = (value) => {
  if (value === 1.0) return '#242d4a'; // Diagonal
  if (value >= 0.8) return '#8b1a1a'; // Dark red, high correlation
  if (value >= 0.5) return '#c4622d'; // Orange
  if (value >= 0.2) return '#2d5f8a'; // Blue
  return '#1a3a5c'; // Dark blue, low correlation
};

export const CorrelationHeatmap = () => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  return (
    <div>
      {/* Heatmap Grid */}
      <div className="overflow-x-auto mb-4">
        <div className="inline-block">
          {/* Header Row */}
          <div className="flex">
            <div className="w-16 h-16"></div>
            {ETFS.map(etf => (
              <div
                key={`header-${etf}`}
                className="w-20 h-16 flex items-center justify-center font-bold text-sm text-[#f5f7fa] border border-[#3a4458]"
              >
                {etf}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {ETFS.map(row => (
            <div key={`row-${row}`} className="flex">
              {/* Row Label */}
              <div className="w-16 h-20 flex items-center justify-center font-bold text-sm text-[#f5f7fa] border border-[#3a4458]">
                {row}
              </div>

              {/* Cells */}
              {ETFS.map(col => {
                const value = CORRELATIONS[row][col];
                const bgColor = getCorrelationColor(value);
                const cellId = `${row}-${col}`;
                const isHovered = hoveredCell === cellId;

                return (
                  <div
                    key={cellId}
                    onMouseEnter={() => {
                      setHoveredCell(cellId);
                      setTooltip({ row, col, value });
                    }}
                    onMouseLeave={() => {
                      setHoveredCell(null);
                      setTooltip(null);
                    }}
                    className="w-20 h-20 flex items-center justify-center font-bold text-white border border-[#3a4458] cursor-pointer transition"
                    style={{
                      background: bgColor,
                      opacity: isHovered ? 1 : 0.9,
                      boxShadow: isHovered ? '0 0 10px rgba(0, 212, 170, 0.5)' : 'none',
                    }}
                  >
                    {value.toFixed(2)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="text-sm text-[#a8b2c7] mb-4 p-3 bg-[#242d4a] rounded-lg border border-[#3a4458]">
          <strong>{tooltip.row}</strong> × <strong>{tooltip.col}</strong>: Corrélation de{' '}
          <strong className="text-[#00d4aa]">{tooltip.value.toFixed(2)}</strong>
          {tooltip.value < 0.3 && ' — très peu corrélés'}
          {tooltip.value >= 0.3 && tooltip.value < 0.7 && ' — modérément corrélés'}
          {tooltip.value >= 0.7 && tooltip.value < 1 && ' — très fortement corrélés'}
        </div>
      )}

      {/* Insight */}
      <div className="text-[#a8b2c7] text-sm p-4 bg-[#242d4a] rounded-lg border border-[#3a4458]">
        💡 <strong>GLD</strong> présente une corrélation quasi nulle avec les ETF actions (0.05–0.15) —{' '}
        <strong className="text-[#00d4aa]">excellent actif de diversification</strong> pour réduire le risque global.
      </div>
    </div>
  );
};
