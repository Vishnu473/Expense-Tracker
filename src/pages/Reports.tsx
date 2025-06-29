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

  // const handleExportChart = async (index: number, type: "png" | "pdf") => {
  //   const target = chartRefs.current[index];
  //   if (!target) return;

  //   const canvas = await html2canvas(target);
  //   if (type === "png") {
  //     const link = document.createElement("a");
  //     link.download = `report-${index + 1}.png`;
  //     link.href = canvas.toDataURL();
  //     link.click();
  //   } else {
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const imgData = canvas.toDataURL("image/png");
  //     const width = 180;
  //     const height = (canvas.height * width) / canvas.width;
  //     pdf.addImage(imgData, "PNG", 15, 15, width, height);
  //     pdf.save(`report-${index + 1}.pdf`);
  //   }
  // };

  // const handleExportAllPDF = async () => {
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   for (let i = 0; i < chartRefs.current.length; i++) {
  //     const chart = chartRefs.current[i];
  //     if (!chart) continue;

  //     const canvas = await html2canvas(chart);
  //     const imgData = canvas.toDataURL("image/png");
  //     const width = 180;
  //     const height = (canvas.height * width) / canvas.width;

  //     if (i > 0) pdf.addPage();
  //     pdf.addImage(imgData, "PNG", 15, 15, width, height);
  //   }
  //   pdf.save("all-reports.pdf");
  // };

  const balance = useBalanceGrowthAnalytics();
  const category = useCategoryExpenseAnalytics();
  const savings = useSavingsProgressAnalytics();
  const payment = usePaymentAppAnalytics();
  const source = useSourceSpendingAnalytics();

  const allEmpty =
    (!balance?.data || balance.data.length === 0) &&
    (!category?.data || category.data.length === 0) &&
    (!savings?.data || savings.data.length === 0) &&
    (!payment?.data || payment.data.length === 0) &&
    (!source?.data || source.data.length === 0);

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

        {allEmpty ? (
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