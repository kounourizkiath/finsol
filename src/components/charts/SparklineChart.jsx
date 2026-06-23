import { LineChart, Line, ResponsiveContainer } from 'recharts';

export const SparklineChart = ({ data, color = '#00d4aa' }) => {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data.slice(-7)}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          dot={false}
          isAnimationActive={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
