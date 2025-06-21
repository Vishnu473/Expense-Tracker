import React from "react";

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

const SummaryCard = React.memo(({ label, value }: { label: string; value: number}) => (
  <div className={`rounded-lg p-4 bg-white shadow dark:shadow-gray-500 dark:bg-gray-800`}>
    <div className="text-md font-semibold dark:text-gray-100">{label}</div>
    <div className={`text-2xl font-bold dark:text-white`}>₹ {value.toLocaleString()}</div>
  </div>
),
(prev, next) =>
    prev.label === next.label &&
    prev.value === next.value
);
