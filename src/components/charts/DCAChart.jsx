import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const DCAChart = ({ data }) => {
  if (!data || !data.results) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data.results}>
        <defs>
          <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a4458" />
        <XAxis dataKey="date" stroke="#a8b2c7" />
        <YAxis stroke="#a8b2c7" />
        <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #3a4458' }} />
        <Area type="monotone" dataKey="invested" stroke="#4ecdc4" fillOpacity={1} fill="url(#colorInvested)" />
        <Area type="monotone" dataKey="value" stroke="#00d4aa" fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
