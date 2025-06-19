import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSavingsProgressAnalytics } from '../../../hooks/useAnalytics';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a2d2ff', '#d00000', '#f48c06'
];

const SavingsProgressChart = () => {
  const { data, isLoading, isError } = useSavingsProgressAnalytics();

  if (isLoading) return <p>Loading savings progress chart...</p>;
  if (isError || !data) return <p>Failed to load savings progress chart</p>;

  const formattedData = data.map((item: any) => ({
    name: item.purpose || 'Saving Goal',
    value: Math.min((item.current_amount / item.amount) * 100, 100)
  }));

  return (
    <div className="w-full h-72">
      <h2 className="text-lg font-semibold text-center dark:text-white mb-2">Savings Progress</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {formattedData.map((_:{current_amount:number, amount:number}, index:number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `${value.toFixed(1)}%`} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsProgressChart;
