const TransactionPageSkeleton = ({
  cardClasses,
  inputClasses,
}: {
  cardClasses: string;
  inputClasses: string;
}) => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Title and Button */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-8 w-36 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>

      {/* Filter section */}
      <div className={`p-4 rounded-lg ${cardClasses} space-y-4`}>
        <div className={`h-6 w-1/4 ${inputClasses} rounded`} />
        <div className={`h-6 w-1/2 ${inputClasses} rounded`} />
      </div>

      {/* Quick sort buttons */}
      <div className="flex space-x-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg shadow ${cardClasses} flex justify-between`}
        >
          <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-4 w-1/6 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-4 w-1/5 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center space-x-3 pt-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionPageSkeleton;