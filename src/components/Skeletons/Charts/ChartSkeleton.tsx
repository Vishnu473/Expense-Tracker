interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie';
  title?: string;
  height?: number;
}

const ChartSkeleton = ({ type = 'bar', title, height = 300 }: ChartSkeletonProps) => {
  return (
    <div className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1">
      {/* Title Skeleton */}
      {title ? (
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64" />
      ) : (
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
      )}
      
      {/* Chart Area */}
      <div 
        className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden relative"
        style={{ height: `${height}px` }}
      >
        {/* Chart Content Based on Type */}
        {type === 'bar' && <BarChartSkeleton />}
        {type === 'line' && <LineChartSkeleton />}
        {type === 'pie' && <PieChartSkeleton />}
        
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

const BarChartSkeleton = () => {
  const bars = Array.from({ length: 6 }, (_, i) => ({
    height: Math.floor(Math.random() * 60) + 40, // Random height between 40-100%
    delay: i * 0.1
  }));

  return (
    <div className="h-full flex items-end justify-around px-8 pb-8 pt-4">
      {bars.map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 max-w-12">
          {/* Bar segments for stacked bar effect */}
          <div className="w-full flex flex-col gap-0.5 items-center">
            <div 
              className="w-8 bg-gray-300 dark:bg-gray-600 rounded-t animate-pulse"
              style={{ 
                height: `${bar.height * 0.4}%`,
                animationDelay: `${bar.delay}s`
              }}
            />
            <div 
              className="w-8 bg-gray-400 dark:bg-gray-500 animate-pulse"
              style={{ 
                height: `${bar.height * 0.35}%`,
                animationDelay: `${bar.delay + 0.1}s`
              }}
            />
            <div 
              className="w-8 bg-gray-500 dark:bg-gray-400 rounded-b animate-pulse"
              style={{ 
                height: `${bar.height * 0.25}%`,
                animationDelay: `${bar.delay + 0.2}s`
              }}
            />
          </div>
          {/* X-axis label */}
          <div className="w-6 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
};

const LineChartSkeleton = () => {
  const points = Array.from({ length: 8 }, (_, i) => ({
    x: (i + 1) * 12.5, // Distribute points evenly
    y: 20 + Math.random() * 60 // Random Y position
  }));

  // Create SVG path
  const pathData = points.reduce((path, point, i) => {
    const command = i === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="h-full p-8 relative">
      {/* Grid lines */}
      <div className="absolute inset-8">
        {/* Horizontal grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-gray-200 dark:bg-gray-600"
            style={{ top: `${i * 25}%` }}
          />
        ))}
        {/* Vertical grid lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-gray-200 dark:bg-gray-600"
            style={{ left: `${i * 20}%` }}
          />
        ))}
      </div>
      
      {/* Line chart */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathData}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gray-400 dark:text-gray-500 animate-pulse"
        />
        {/* Data points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="0.8"
            className="fill-gray-400 dark:fill-gray-500 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-2 left-8 right-8 flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-8 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
};

const PieChartSkeleton = () => {
  const segments = [
    { angle: 120, color: 'bg-gray-300 dark:bg-gray-600' },
    { angle: 90, color: 'bg-gray-400 dark:bg-gray-500' },
    { angle: 80, color: 'bg-gray-500 dark:bg-gray-400' },
    { angle: 70, color: 'bg-gray-600 dark:bg-gray-300' }
  ];

  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative">
        {/* Main circle */}
        <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
          {/* Pie segments simulation */}
          <div className="absolute inset-4 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
          <div className="absolute inset-8 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse" />
          <div className="absolute inset-12 rounded-full bg-gray-500 dark:bg-gray-400 animate-pulse" />
          
          {/* Center hole for donut effect */}
          <div className="absolute inset-16 rounded-full bg-gray-50 dark:bg-gray-800" />
        </div>
        
        {/* Legend dots */}
        <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 space-y-3">
          {segments.map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse" />
              <div className="w-12 h-2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;

// // Example usage component showing how to use it correctly
// const ExampleUsage = () => {
//   return (
//     <div className="max-w-xl md:max-w-4xl w-full flex md:flex-row gap-4 flex-col">
//       {/* Correct usage - no nested containers */}
//       <React.Suspense fallback={<ChartSkeleton type="line" height={340} />}>
//         <MonthlyTrendChart />
//       </React.Suspense>
      
//       <React.Suspense fallback={<ChartSkeleton type="bar" height={340} />}>
//         <FinancialOverviewChart />
//       </React.Suspense>
//     </div>
//   );
// };

// // Mock components for demo
// const MonthlyTrendChart = () => (
//   <div className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1 h-[340px]">
//     <h2 className="text-lg font-semibold">Monthly Trend</h2>
//     <div className="flex-1 bg-blue-100 rounded flex items-center justify-center">
//       Line Chart Content
//     </div>
//   </div>
// );

// const FinancialOverviewChart = () => (
//   <div className="p-4 rounded-lg shadow flex flex-col gap-5 bg-white dark:bg-gray-900 flex-1 h-[340px]">
//     <h2 className="text-lg font-semibold">Financial Overview</h2>
//     <div className="flex-1 bg-green-100 rounded flex items-center justify-center">
//       Bar Chart Content
//     </div>
//   </div>
// );

// export { ExampleUsage };