import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSourceSpendingAnalytics } from '../../../hooks/useAnalytics';

type SourceSpending = {
  source: string;
  total: number;
};

const SourceSpendingChart = () => {
  const { data, isLoading, isError } = useSourceSpendingAnalytics();

  if (isLoading) return <p>Loading source spending chart...</p>;
  if (isError || !data) return <p>Failed to load source spending chart</p>;

  // Format data with fallback for empty source name
  const formattedData: SourceSpending[] = data.map((item: any) => ({
    source: item.source || 'Unknown',
    total: item.total,
  }));

  return (
    <div className="w-full h-72">
      <h2 className="text-lg font-semibold text-center dark:text-white mb-2">
        Source-wise Spending
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <XAxis dataKey="source" />
          <YAxis />
          
          <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Expense (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SourceSpendingChart;