import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBalanceGrowthAnalytics } from '../../../hooks/useAnalytics';

const BalanceGrowthChart = () => {
  const { data, isLoading, isError } = useBalanceGrowthAnalytics();

  if (isLoading) return <p>Loading balance growth chart...</p>;
  if (isError || !data) return <p>Failed to load balance growth chart</p>;

  return (
    <div className="w-full h-72">
      <h2 className="text-lg font-semibold text-center dark:text-white mb-2">Balance Growth Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#00C49F" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceGrowthChart;