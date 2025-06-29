import ChartSkeleton from "../components/Skeletons/Charts/ChartSkeleton";
import { WalletSummary } from "../components/Wallet/WalletSummary";
import { useFinancialOverviewAnalytics, useMonthlyTrendAnalytics } from "../hooks/useAnalytics";
import { useWallet } from "../hooks/useWallet";
import { lazy, Suspense } from "react";

const MonthlyTrendChart = lazy(() => import("../components/Charts/Dashboard/MonthlyTrendChart"));
const FinancialOverviewChart = lazy(() => import("../components/Charts/Dashboard/FinancialOverViewChart"));

const Dashboard = () => {
  const { data, isLoading, error } = useWallet();

  const monthlyData = useMonthlyTrendAnalytics();
  const financeData = useFinancialOverviewAnalytics();

  const allEmpty =
    (!monthlyData?.data || monthlyData.data.length === 0) &&
    (!financeData?.data || financeData.data.length === 0);

  if (isLoading) return <div aria-busy="true">Loading Wallet...</div>;
  if (error) return <div aria-busy="true">Error fetching wallet info</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl p-6 mx-auto w-full">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Dashboard</h1>
        <WalletSummary {...data} />
      </div>
      <div className="max-w-4xl flex flex-col items-center p-4 mx-auto w-full mt-4 md:mt-10">
            <h2 className="text-lg md:text-2xl font-semibold mb-4 text-blue-500 dark:text-gray-200">Detailed Reports based on your Expenses, Income, Savings, Balance</h2>
      {
        allEmpty ?
          <div className="min-h-[40vh] flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
            Data is insufficient to render charts. Add some transactions to get started.
          </div>
          : 
            <div className="max-w-xl md:max-w-4xl w-full flex md:flex-row gap-4 flex-col space-y-6">
              <Suspense fallback={<div className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1 h-[340px]"><ChartSkeleton type="line" /></div>}>
                <MonthlyTrendChart />
              </Suspense>
              <Suspense fallback={<div className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1 h-[340px]"><ChartSkeleton type="bar" /></div>}>
                <FinancialOverviewChart />
              </Suspense>
            </div>
      }
      </div>
    </div>
  );
};

export default Dashboard;
