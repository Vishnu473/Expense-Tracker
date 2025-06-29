import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { usePaymentAppAnalytics } from '../../../hooks/useAnalytics';
import ChartSkeleton from '../../Skeletons/Charts/ChartSkeleton';
import ErrorMessageFallBackUI from '../../Skeletons/Charts/ErrorMessageFallBackUI';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];

export type PaymentAppAnalytics = {
  payment_app: string;
  transactionCount: number;
};

const PaymentAppAnalyticsChart = () => {
  const { data, isLoading, isError } = usePaymentAppAnalytics();

  if (isLoading) return <ChartSkeleton type='pie'/>;
  if (isError || !data || data.length === 0) return <ErrorMessageFallBackUI message='Failed to load PaymentApp analytics chart' />;

  // Normalize API response
  const parsedData: PaymentAppAnalytics[] = data.map(
    (item: { app: string; count: number }) => ({
      payment_app: item.app,
      transactionCount: item.count,
    })
  );

  return (
    <div className="w-full h-72">
      <h2 className="text-lg font-semibold text-center dark:text-white mb-2">
        Payment App Usage
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={parsedData}
            dataKey="transactionCount"
            nameKey="payment_app"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            // label={({ name, percent }) =>
            //   `${name} (${(percent * 100).toFixed(0)}%)`
            // }
          >
            {parsedData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} txns`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentAppAnalyticsChart;