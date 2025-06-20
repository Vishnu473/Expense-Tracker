import { useEffect, useState } from 'react';

interface ProgressBarProps {
  targetPercent: number;
}

const ProgressBar = ({ targetPercent }: ProgressBarProps) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth(targetPercent);
    }, 100);

    return () => clearTimeout(timeout);
  }, [targetPercent]);

  return (
    <div className="w-full h-1.5 bg-zinc-200 dark:bg-gray-400 rounded-full overflow-hidden mb-1">
      <div
        className="h-full bg-blue-600 dark:bg-gray-900 rounded-md transition-all duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ProgressBar;