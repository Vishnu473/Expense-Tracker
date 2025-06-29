import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useFinancialOverviewAnalytics } from '../../../hooks/useAnalytics';
import ChartSkeleton from '../../Skeletons/Charts/ChartSkeleton';
import ErrorMessageFallBackUI from '../../Skeletons/Charts/ErrorMessageFallBackUI';

const FinancialOverviewChart = () => {
  const { data, isLoading, isError } = useFinancialOverviewAnalytics();

  if (isLoading) return <ChartSkeleton type='bar'/>;
  if (isError || !data || data.length === 0) return <ErrorMessageFallBackUI message='Failed to load financial overview chart.'/>;

  return (
    <div role="img" aria-describedby="Financial overview chart" className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1">
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