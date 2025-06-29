const SavingCardSkeleton = () => (
  <div
    className="animate-pulse bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex flex-col gap-4"
    role="presentation"
    aria-hidden="true"
  >
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4" />
        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
      <div className="flex-1 h-28 bg-gray-300 dark:bg-gray-600 rounded-lg" />
    </div>
    <div>
      <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
      <div className="w-full h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mb-1" />
      <div className="h-4 w-2/5 bg-gray-300 dark:bg-gray-600 rounded mt-2" />
    </div>
  </div>
);

export default SavingCardSkeleton;