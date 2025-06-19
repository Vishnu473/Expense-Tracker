import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePaymentAppAnalytics } from '../../../hooks/useAnalytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];
export type PaymentAppanalytics = {
  transactionCount: number; 
  payment_app: string; 
};
const PaymentAppAnalyticsChart = () => {
  const { data, isLoading, isError } = usePaymentAppAnalytics();

  if (isLoading) return <p>Loading payment app analytics...</p>;
  if (isError || !data) return <p>Failed to load chart</p>;

  return (
    <div className="w-full h-72">
      <h2 className="text-lg font-semibold text-center dark:text-white mb-2">Payment App Usage</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="transactionCount"
            nameKey="payment_app"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_:PaymentAppanalytics, index:number) => (
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

export default PaymentAppAnalyticsChart;