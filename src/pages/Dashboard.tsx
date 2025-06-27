import { WalletSummary } from "../components/Wallet/WalletSummary";
import { useWallet } from "../hooks/useWallet";
import { lazy, Suspense } from "react";

const MonthlyTrendChart = lazy(() => import("../components/Charts/Dashboard/MonthlyTrendChart"));
const FinancialOverviewChart = lazy(() => import("../components/Charts/Dashboard/FinancialOverViewChart"));

const Dashboard = () => {
  const { data, isLoading, error } = useWallet();

  if (isLoading) return <div aria-busy="true">Loading Wallet...</div>;
  if (error) return <div aria-busy="true">Error fetching wallet info</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl p-6 mx-auto w-full">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Dashboard</h1>
        <WalletSummary {...data} />
      </div>
      <div className="max-w-4xl flex flex-col items-center p-4 mx-auto w-full mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-gray-200">Detailed Reports based on your Expenses, Income, Savings, Balance</h2>
        <div className="max-w-xl md:max-w-4xl w-full flex md:flex-row gap-4 flex-col space-y-6">
          <Suspense fallback={<div aria-busy="true">📊 Loading Monthly Trend...</div>}>
            <MonthlyTrendChart />
          </Suspense>
          <Suspense fallback={<div aria-busy="true">📊 Loading Financial Overview...</div>}>
            <FinancialOverviewChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
