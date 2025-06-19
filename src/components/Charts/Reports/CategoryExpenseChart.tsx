import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCategoryExpenseAnalytics } from '../../../hooks/useAnalytics';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

export type CategoryExpense = {
  category_name: string;
  total_expense: number;
};

const CategoryExpenseChart = () => {
  const { data, isLoading, isError } = useCategoryExpenseAnalytics();

  if (isLoading) return <p>Loading category expense chart...</p>;
  if (isError || !data) return <p>Failed to load chart</p>;

  return (
    <div className="w-full h-72">
      <h2 className="text-lg font-semibold text-center dark:text-white mb-2">Category-wise Expense</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total_expense"
            nameKey="category_name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_: CategoryExpense, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryExpenseChart;