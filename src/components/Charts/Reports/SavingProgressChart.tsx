import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSavingsProgressAnalytics } from '../../../hooks/useAnalytics';
import ChartSkeleton from '../../Skeletons/Charts/ChartSkeleton';
import ErrorMessageFallBackUI from '../../Skeletons/Charts/ErrorMessageFallBackUI';

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7f50',
  '#a2d2ff',
  '#d00000',
  '#f48c06',
];

type SavingsProgress = {
  id: string;
  purpose: string;
  current_amount: number;
  target_amount: number;
  percent: string;
  is_completed: boolean;
};

const SavingsProgressChart = () => {
  const { data, isLoading, isError } = useSavingsProgressAnalytics();

  if (isLoading) return (
    <ChartSkeleton type='pie' />);
  if (isError || !data || data.length === 0) return <ErrorMessageFallBackUI message='Failed to load savings progress chart' />;

  const formattedData = data.map((item: SavingsProgress) => ({
    name: item.purpose || 'Saving Goal',
    value: Math.min(parseFloat(item.percent), 100), // safety clamp
  }));

  return (
    data.length === 0 || !data ? (
      <div className="min-h-[40vh] flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
        Data is insufficient to render charts. Add some transactions to get started.
      </div>) :
      <div className="w-full h-72">
        <h2 className="text-lg font-semibold text-center dark:text-white mb-2">
          Savings Progress
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              labelLine={false}
            // label={({ name, percent }) =>
            //   `${name} (${(percent * 100).toFixed(0)}%)`
            // }
            >
              {formattedData.map((_: SavingsProgress, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
  );
};

export default SavingsProgressChart;