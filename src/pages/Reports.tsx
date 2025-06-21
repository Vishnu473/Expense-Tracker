import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";

const BalanceGrowthChart = lazy(() => import("../components/Charts/Reports/BalanceGrowthChart"));
const CategoryExpenseChart = lazy(() => import("../components/Charts/Reports/CategoryExpenseChart"));
const SavingsProgressChart = lazy(() => import("../components/Charts/Reports/SavingProgressChart"));
const SourceSpendingChart = lazy(() => import("../components/Charts/Reports/SourceSpendingchart"));
const PaymentAppAnalyticsChart = lazy(() => import("../components/Charts/Reports/PaymentAnalyticsChart"));

export default function Reports() {
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleExportChart = async (index: number, type: "png" | "pdf") => {
    const target = chartRefs.current[index];
    if (!target) return;

    const canvas = await html2canvas(target);
    if (type === "png") {
      const link = document.createElement("a");
      link.download = `report-${index + 1}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const width = 180;
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 15, 15, width, height);
      pdf.save(`report-${index + 1}.pdf`);
    }
  };

  const handleExportAllPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < chartRefs.current.length; i++) {
      const chart = chartRefs.current[i];
      if (!chart) continue;

      const canvas = await html2canvas(chart);
      const imgData = canvas.toDataURL("image/png");
      const width = 180;
      const height = (canvas.height * width) / canvas.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 15, 15, width, height);
    }
    pdf.save("all-reports.pdf");
  };

  const charts = [
  <Suspense fallback={<div>📈 Loading...</div>}><BalanceGrowthChart key="balance" /></Suspense>,
  <Suspense fallback={<div>📈 Loading...</div>}><CategoryExpenseChart key="category" /></Suspense>,
  <Suspense fallback={<div>📈 Loading...</div>}><PaymentAppAnalyticsChart key="payment" /></Suspense>,
  <Suspense fallback={<div>📈 Loading...</div>}><SavingsProgressChart key="savings" /></Suspense>,
  <Suspense fallback={<div>📈 Loading...</div>}><SourceSpendingChart key="source" /></Suspense>,
];

  return (
    <div className="p-6 md:p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
          📊 Reports Dashboard
        </h1>
        <button
          onClick={handleExportAllPDF}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
        >
          Export All Reports as PDF
        </button>
      </div>

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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 pb-12 sm:p-6 sm:pb-12 relative"
          >
            <div className="absolute right-4 top-4 flex gap-2">
              <button
                onClick={() => handleExportChart(index, "png")}
                className="text-xs px-2 py-1 bg-zinc-200 dark:bg-gray-600 text-zinc-700 dark:text-white rounded hover:bg-zinc-300 dark:hover:bg-gray-700"
              >
                PNG
              </button>
              <button
                onClick={() => handleExportChart(index, "pdf")}
                className="text-xs px-2 py-1 bg-zinc-200 dark:bg-gray-600 text-zinc-700 dark:text-white rounded hover:bg-zinc-300 dark:hover:bg-gray-700"
              >
                PDF
              </button>
            </div>
            {ChartComponent}
          </motion.div>
        ))}
      </div>
    </div>
  );
}