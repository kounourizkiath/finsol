import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const PerformanceChart = ({ data }) => {
  if (!data || !data.history) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.history}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a4458" />
        <XAxis dataKey="date" stroke="#a8b2c7" />
        <YAxis stroke="#a8b2c7" />
        <Tooltip
          contentStyle={{ background: '#1a1f3a', border: '1px solid #3a4458', borderRadius: 8 }}
          labelStyle={{ color: '#f5f7fa' }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#00d4aa"
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
