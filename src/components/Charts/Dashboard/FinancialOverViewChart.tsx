import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useFinancialOverviewAnalytics } from '../../../hooks/useAnalytics';

const FinancialOverviewChart = () => {
  const { data, isLoading, isError } = useFinancialOverviewAnalytics();

  if (isLoading) return <p>Loading Financial Overview...</p>;
  if (isError) return <p>Failed to load financial overview.</p>;

  return (
    <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 flex-1">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">Monthly Financial Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} stackOffset="sign">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" stackId="a" fill="#34d399" />
          <Bar dataKey="expense" stackId="a" fill="#f87171" />
          <Bar dataKey="savings" stackId="a" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialOverviewChart;