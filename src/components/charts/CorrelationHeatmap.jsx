import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ETFS } from '../../constants/etfConfig';

export const CorrelationHeatmap = () => {
  const data = ETFS.map((etf, i) => ({
    x: i,
    y: Math.random() * 100,
    name: etf,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a4458" />
        <XAxis type="number" dataKey="x" stroke="#a8b2c7" />
        <YAxis type="number" dataKey="y" stroke="#a8b2c7" />
        <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #3a4458' }} />
        <Scatter data={data} fill="#00d4aa" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
