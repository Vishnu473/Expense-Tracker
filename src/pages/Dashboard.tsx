import ChartSkeleton from "../components/Skeletons/Charts/ChartSkeleton";
import { WalletSummary } from "../components/Wallet/WalletSummary";
import { useFinancialOverviewAnalytics, useMonthlyTrendAnalytics } from "../hooks/useAnalytics";
import { useWallet } from "../hooks/useWallet";
import { lazy, Suspense } from "react";

const MonthlyTrendChart = lazy(() => import("../components/Charts/Dashboard/MonthlyTrendChart"));
const FinancialOverviewChart = lazy(() => import("../components/Charts/Dashboard/FinancialOverViewChart"));

const Dashboard = () => {
  const wallet = useWallet();
  const monthlyData = useMonthlyTrendAnalytics();
  const financeData = useFinancialOverviewAnalytics();

  const isChartLoading = monthlyData.isLoading || financeData.isLoading;
  const isChartError = monthlyData.isError || financeData.isError;
  const allChartEmpty =
    (!monthlyData.data || monthlyData.data.length === 0) &&
    (!financeData.data || financeData.data.length === 0);

  if (wallet.isLoading) {
    return (
      <div className="h-screen dark:bg-gray-800 min-h-screen p-6 max-w-4xl mx-auto">
        <div className="animate-pulse grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3,4].map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow h-32 flex flex-col justify-between"
            >
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid gap-6 mt-13 md:mt-10 sm:grid-cols-1 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <ChartSkeleton key={index} />
            ))}
          </div>
      </div>
    );
  }

  if (wallet.error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-500" aria-busy="true">
        Error fetching wallet info
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl p-6 mx-auto w-full">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Dashboard</h1>
        <WalletSummary {...wallet.data} />
      </div>

      <div className="max-w-4xl flex flex-col items-center p-4 mx-auto w-full mt-4 md:mt-10">
        <h2 className="text-lg md:text-2xl font-semibold mb-4 text-blue-500 dark:text-gray-200">
          Detailed Reports based on your Expenses, Income, Savings, Balance
        </h2>

        {isChartLoading ? (
          <div className="max-w-xl md:max-w-4xl w-full flex lg:flex-row gap-4 flex-col space-y-6">
            <div className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1 h-[340px]">
              <ChartSkeleton type="line" />
            </div>
            <div className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1 h-[340px]">
              <ChartSkeleton type="bar" />
            </div>
          </div>
        ) : isChartError ? (
          <div className="min-h-[40vh] flex items-center justify-center text-center text-red-500 dark:text-red-400">
            Server error while loading charts. Please try again later.
          </div>
        ) : allChartEmpty ? (
          <div className="min-h-[40vh] flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
            Data is insufficient to render charts. Add some transactions to get started.
          </div>
        ) : (
          <div className="max-w-xl md:max-w-4xl w-full flex lg:flex-row gap-4 flex-col space-y-6">
            <Suspense fallback={<ChartSkeleton type="line" />}>
              <MonthlyTrendChart />
            </Suspense>
            <Suspense fallback={<ChartSkeleton type="bar" />}>
              <FinancialOverviewChart />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};


export default Dashboard;
