import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatPrice, formatPercentChange } from '../../utils/formatters';
import { ETF_CONFIG } from '../../constants/etfConfig';

export const ETFCard = ({ etf, data, onClick, selected }) => {
  if (!data) return null;

  const changePercent = ((data.change / (data.price - data.change)) * 100);
  const config = ETF_CONFIG[etf];
  const { text, isPositive, arrow } = formatPercentChange(changePercent);

  return (
    <div
      onClick={onClick}
      className={`bg-[#1a1f3a] border rounded-lg p-4 cursor-pointer transition ${
        selected ? 'border-[#00d4aa] shadow-lg' : 'border-[#3a4458] hover:border-[#00d4aa]'
      }`}
    >
      <div className="text-lg font-bold text-[#f5f7fa] mb-2">{etf}</div>
      <div className="text-3xl font-bold text-[#00d4aa] mb-1">
        {formatPrice(data.price)}
      </div>
      <div className={`text-sm font-bold mb-3 ${isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
        {arrow} {text}
      </div>

      {data.history && data.history.length > 0 && (
        <ResponsiveContainer width="100%" height={40}>
          <LineChart data={data.history.slice(-7)}>
            <Line
              type="monotone"
              dataKey="price"
              stroke={config.color}
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
