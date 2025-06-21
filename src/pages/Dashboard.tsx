import { WalletSummary } from "../components/Wallet/WalletSummary";
import { useWallet } from "../hooks/useWallet";
import { lazy, Suspense } from "react";

const MonthlyTrendChart = lazy(() => import("../components/Charts/Dashboard/MonthlyTrendChart"));
const FinancialOverviewChart = lazy(() => import("../components/Charts/Dashboard/FinancialOverViewChart"));

const Dashboard = () => {
  const { data, isLoading, error } = useWallet();

  if (isLoading) return <div>Loading Wallet...</div>;
  if (error) return <div>Error fetching wallet info</div>;

  return (
    <>
      <div className="max-w-4xl p-4 mx-auto w-full">
        <h2 className="text-3xl font-semibold mb-4 dark:text-white">Dashboard</h2>
        <WalletSummary {...data} />
      </div>
      <div className="max-w-4xl p-4 mx-auto w-full mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-gray-200">Detailed Reports based on your Expenses, Income, Savings, Balance</h2>
        <div className="w-full flex flex-col md:flex-row space-y-6">
          <Suspense fallback={<div>📊 Loading Monthly Trend...</div>}>
            <MonthlyTrendChart />
          </Suspense>
          <Suspense fallback={<div>📊 Loading Financial Overview...</div>}>
            <FinancialOverviewChart />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
