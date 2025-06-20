import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useBalanceGrowthAnalytics } from '../../../hooks/useAnalytics';
import { format, parse } from 'date-fns';

interface BalanceGrowth {
  month: string; // e.g., "4-2025"
  balance: string; // e.g., "100120.00"
}

interface ParsedBalanceGrowth {
  month: string; // e.g., "Apr 2025"
  balance: number;
}

const BalanceGrowthChart = () => {
  const { data, isLoading, isError } = useBalanceGrowthAnalytics();

  if (isLoading) return <p>Loading balance growth chart...</p>;
  if (isError || !data) return <p>Failed to load balance growth chart</p>;

  const parsedData: ParsedBalanceGrowth[] = data.map((d: BalanceGrowth) => ({
    month: format(parse(`01-${d.month}`, 'dd-M-yyyy', new Date()), 'MMM yyyy'),
    balance: parseFloat(d.balance),
  }));

  return (
    <div className="w-full h-72">
      <h2 className="text-lg font-semibold text-center dark:text-white mb-2">Balance Growth Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={parsedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(val) => `₹${val.toLocaleString()}`} />
          <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#00C49F"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceGrowthChart;