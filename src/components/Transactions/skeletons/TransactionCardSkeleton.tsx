const TransactionCardSkeleton = () => (
  <div className="p-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex justify-between items-start mb-2">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="text-right space-y-2">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
    <div className="flex justify-between items-center mt-2">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);
export default TransactionCardSkeleton;