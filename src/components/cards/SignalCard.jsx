import { getSignal, getConfidenceScore, calcRSI, calcMA, calcMomentum } from '../../utils/indicators';

export const SignalCard = ({ etf, prices }) => {
  const signal = getSignal(prices);
  const confidence = getConfidenceScore(prices);
  const rsi = calcRSI(prices);
  const ma20 = calcMA(prices, 20);
  const ma50 = calcMA(prices, 50);
  const momentum = calcMomentum(prices);

  const signalColor = signal === 'BUY' ? '#10b981' : signal === 'SELL' ? '#ef4444' : '#f59e0b';
  const trendDirection = ma20 && ma50 ? (ma20 > ma50 ? '↑' : '↓') : '→';

  return (
    <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-4 hover:border-[#00d4aa] transition">
      <div className="text-lg font-bold text-[#f5f7fa] mb-3">{etf}</div>
      <div
        className="px-3 py-1 rounded font-bold text-sm mb-3 inline-block"
        style={{ background: `${signalColor}30`, color: signalColor }}
      >
        {signal}
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-[#a8b2c7]">RSI:</span>
          <span className="text-[#f5f7fa] font-mono">{rsi ? rsi.toFixed(1) : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a8b2c7]">Tendance:</span>
          <span className="text-[#f5f7fa]">{trendDirection} {ma20 && ma50 ? 'MA20/50' : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a8b2c7]">Momentum:</span>
          <span className={`font-mono ${momentum && momentum > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {momentum ? (momentum > 0 ? '+' : '') + momentum.toFixed(2) + '%' : 'N/A'}
          </span>
        </div>
        <div className="mt-2 bg-[#242d4a] rounded h-2 overflow-hidden">
          <div
            className="bg-[#00d4aa] h-full rounded"
            style={{ width: `${Math.min(100, confidence)}%` }}
          ></div>
        </div>
        <div className="text-[#a8b2c7]">Conviction: {Math.round(confidence)}%</div>
      </div>
    </div>
  );
};
