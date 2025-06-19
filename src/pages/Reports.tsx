import BalanceGrowthChart from "../components/Charts/Reports/BalanceGrowthChart";
import CategoryExpenseChart from "../components/Charts/Reports/CategoryExpenseChart";
import PaymentAppAnalyticsChart from "../components/Charts/Reports/PaymentanalyticsChart";
import SavingsProgressChart from "../components/Charts/Reports/SavingProgressChart";
import SourceSpendingChart from "../components/Charts/Reports/SourceSpendingchart";

export default function Reports() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BalanceGrowthChart />
        <CategoryExpenseChart />
        <PaymentAppAnalyticsChart />
        <SavingsProgressChart />
        <SourceSpendingChart />
      </div>
    </div>
  );
}