const TransactionRowSkeleton = ({ style }: { style: React.CSSProperties }) => (
  <div
    style={style}
    className="grid grid-cols-[1fr_1fr_3fr_1.5fr_1fr_1fr] px-6 py-4 border-b dark:border-gray-700 animate-pulse text-sm"
  >
    {Array(6).fill(null).map((_, i) => (
      <div key={i} className="h-4 rounded bg-gray-300 dark:bg-gray-700 w-5/6" />
    ))}
  </div>
);
export default TransactionRowSkeleton;