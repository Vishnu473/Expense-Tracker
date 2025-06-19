import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSourceSpendingAnalytics } from '../../../hooks/useAnalytics';

const SourceSpendingChart = () => {
  const { data, isLoading, isError } = useSourceSpendingAnalytics();

  if (isLoading) return <p>Loading source spending chart...</p>;
  if (isError || !data) return <p>Failed to load source spending chart</p>;

  return (
    <div className="w-full h-72">
      <h2 className="text-lg font-semibold text-center dark:text-white mb-2">Source-wise Spending</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="source_detail" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_expense" fill="#8884d8" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SourceSpendingChart;
