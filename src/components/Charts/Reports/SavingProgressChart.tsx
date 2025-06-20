import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSavingsProgressAnalytics } from '../../../hooks/useAnalytics';

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

  if (isLoading) return <p>Loading savings progress chart...</p>;
  if (isError || !data) return <p>Failed to load savings progress chart</p>;

  const formattedData = data.map((item: SavingsProgress) => ({
    name: item.purpose || 'Saving Goal',
    value: Math.min(parseFloat(item.percent), 100), // safety clamp
  }));

  return (
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
            {formattedData.map((_:SavingsProgress, index:number) => (
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