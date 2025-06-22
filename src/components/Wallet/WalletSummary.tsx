import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

type WalletData = {
  balance: number;
  income: number;
  expense: number;
  savings: number;
};

export const WalletSummary = ({ balance, income, expense, savings }: WalletData) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <SummaryCard label="Balance" value={balance} />
      <SummaryCard label="Income" value={income} />
      <SummaryCard label="Expense" value={expense} />
      <SummaryCard label="Savings" value={savings} />
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: number;
}

const SummaryCard = React.memo(({ label, value }: SummaryCardProps) => {
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value); // triggers animation
    }
  }, [value]);

  return (
    <div className="transition-colors rounded-md p-4 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-900 bg-white shadow dark:shadow-gray-500 dark:bg-gray-700">
      <div className="text-md font-semibold dark:text-gray-100">{label}</div>
      <div className="text-2xl font-bold dark:text-white">
        ₹{" "}
        <CountUp
          start={prevValue}
          end={value}
          duration={2.5}
          separator=","
          decimals={0}
          preserveValue={true}
        />
      </div>
    </div>
  );
}, (prev, next) => prev.label === next.label && prev.value === next.value);

// const SummaryCard = React.memo(({ label, value }: { label: string; value: number}) => (
//   <div className={`rounded-lg p-4 bg-white shadow dark:shadow-gray-500 dark:bg-gray-800`}>
//     <div className="text-md font-semibold dark:text-gray-100">{label}</div>
//     <div className={`text-2xl font-bold dark:text-white`}>₹ {value.toLocaleString()}</div>
//   </div>
// ),
// (prev, next) =>
//     prev.label === next.label &&
//     prev.value === next.value
// );
