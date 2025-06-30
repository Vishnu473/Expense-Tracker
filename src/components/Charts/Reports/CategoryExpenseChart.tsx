import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCategoryExpenseAnalytics } from '../../../hooks/useAnalytics';
import ChartSkeleton from '../../Skeletons/Charts/ChartSkeleton';
import ErrorMessageFallBackUI from '../../Skeletons/Charts/ErrorMessageFallBackUI';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

export interface CategoryExpense {
  category_name: string;
  total_expense: number;
}

const CategoryExpenseChart = () => {
  const { data, isLoading, isError } = useCategoryExpenseAnalytics();

  if (isLoading) return <ChartSkeleton type='pie' />;
  if (isError || !data || data.length === 0) return <ErrorMessageFallBackUI message='Failed to load category expense chart' />;

  // Transform the API shape to the expected shape
  const parsedData: CategoryExpense[] = data.map(
    (item: { category: string; total: number }) => ({
      category_name: item.category,
      total_expense: item.total,
    })
  );

  return (
    data.length === 0 || !data ? (
      <div className="min-h-[40vh] flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
        Data is insufficient to render charts. Add some transactions to get started.
      </div>) :
      <div className="w-full h-72">
        <h2 className="text-lg font-semibold text-center dark:text-white mb-2">
          Category-wise Expense
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={parsedData}
              dataKey="total_expense"
              nameKey="category_name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
            // label={({ name, percent }) =>
            //   `${name} (${(percent * 100).toFixed(0)}%)`
            // }
            >
              {parsedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
  );
};

export default CategoryExpenseChart;