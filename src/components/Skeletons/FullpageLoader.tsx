import { FaSpinner } from "react-icons/fa";

export default function FullPageLoader() {
  return (
    <div aria-busy="true" className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-blue-700 dark:text-cyan-500">
      <FaSpinner className="text-xl md:text-4xl animate-spin mb-4" />
      <h1 className="text-lg md:text-4xl font-semibold animate-pulse">Expense Tracker</h1>
    </div>
  );
}
