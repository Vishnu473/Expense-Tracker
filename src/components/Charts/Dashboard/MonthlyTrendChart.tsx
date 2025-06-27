import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMonthlyTrendAnalytics } from '../../../hooks/useAnalytics';

const MonthlyTrendChart = () => {
  const { data, isLoading, isError } = useMonthlyTrendAnalytics();

  if (isLoading) return <p aria-busy="true">Loading Monthly Trend...</p>;
  if (isError) return <p aria-busy="true">Failed to load trend chart.</p>;

  return (
    <div role="img" aria-describedby="monthly trend chart" className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">Monthly Income vs Expense</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} />
          <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;