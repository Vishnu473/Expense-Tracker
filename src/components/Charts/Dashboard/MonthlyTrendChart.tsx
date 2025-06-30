import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMonthlyTrendAnalytics } from '../../../hooks/useAnalytics';
import ChartSkeleton from '../../Skeletons/Charts/ChartSkeleton';
import ErrorMessageFallBackUI from '../../Skeletons/Charts/ErrorMessageFallBackUI';

const MonthlyTrendChart = () => {
  const { data, isLoading, isError } = useMonthlyTrendAnalytics();

  if (isLoading) return <ChartSkeleton type='line' />;
  if (isError) return <ErrorMessageFallBackUI message='Failed to load trend chart.' />;

  return (
    data.length === 0 || !data ? (
      <div className="min-h-[40vh] flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
        Data is insufficient to render charts. Add some transactions to get started.
      </div>) :
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