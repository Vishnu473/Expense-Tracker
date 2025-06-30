import { useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import ChartSkeleton from "../components/Skeletons/Charts/ChartSkeleton";
import { useBalanceGrowthAnalytics, useCategoryExpenseAnalytics, usePaymentAppAnalytics, useSavingsProgressAnalytics, useSourceSpendingAnalytics } from "../hooks/useAnalytics";

const BalanceGrowthChart = lazy(() => import("../components/Charts/Reports/BalanceGrowthChart"));
const CategoryExpenseChart = lazy(() => import("../components/Charts/Reports/CategoryExpenseChart"));
const SavingsProgressChart = lazy(() => import("../components/Charts/Reports/SavingProgressChart"));
const SourceSpendingChart = lazy(() => import("../components/Charts/Reports/SourceSpendingchart"));
const PaymentAppAnalyticsChart = lazy(() => import("../components/Charts/Reports/PaymentAnalyticsChart"));

export default function Reports() {
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

  const balance = useBalanceGrowthAnalytics();
  const category = useCategoryExpenseAnalytics();
  const savings = useSavingsProgressAnalytics();
  const payment = usePaymentAppAnalytics();
  const source = useSourceSpendingAnalytics();

  const isLoading =
    balance.isLoading ||
    category.isLoading ||
    savings.isLoading ||
    payment.isLoading ||
    source.isLoading;

  const anyError =
    balance.isError ||
    category.isError ||
    savings.isError ||
    payment.isError ||
    source.isError;

  const allEmpty =
    !balance.data?.length &&
    !category.data?.length &&
    !savings.data?.length &&
    !payment.data?.length &&
    !source.data?.length;


  const charts = [
    <Suspense fallback={<ChartSkeleton />}><BalanceGrowthChart key="balance" /></Suspense>,
    <Suspense fallback={<ChartSkeleton />}><CategoryExpenseChart key="category" /></Suspense>,
    <Suspense fallback={<ChartSkeleton />}><PaymentAppAnalyticsChart key="payment" /></Suspense>,
    <Suspense fallback={<ChartSkeleton />}><SavingsProgressChart key="savings" /></Suspense>,
    <Suspense fallback={<ChartSkeleton />}><SourceSpendingChart key="source" /></Suspense>,
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="p-6 md:p-6 max-w-4xl w-full mx-auto min-h-screen">

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
            📊 Reports Dashboard
          </h1>
        </div>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <ChartSkeleton key={index} />
            ))}
          </div>
        ) : anyError ? (
          <div className="min-h-[40vh] flex items-center justify-center text-center text-red-500 dark:text-red-400">
            Server error while fetching analytics. Please try again later.
          </div>
        ) : allEmpty ? (
          <div className="min-h-[40vh] flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
            Data is insufficient to render charts. Add some transactions to get started.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {charts.map((ChartComponent, index) => (
              <motion.div
                key={index}
                ref={(el) => {
                  chartRefs.current[index] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 pb-12 sm:p-6 sm:pb-12 relative"
              >
                {ChartComponent}
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );

}