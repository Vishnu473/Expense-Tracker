type WalletData = {
  balance: number;
  income: number;
  expense: number;
  savings: number;
};

export const WalletSummary = ({ balance, income, expense, savings }: WalletData) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <SummaryCard label="Balance" value={balance} color="text-blue-500" />
      <SummaryCard label="Income" value={income} color="text-green-500" />
      <SummaryCard label="Expense" value={expense} color="text-red-500" />
      <SummaryCard label="Savings" value={savings} color="text-purple-500" />
    </div>
  );
};

const SummaryCard = ({ label, value }: { label: string; value: number; color: string }) => (
  <div className={`rounded-lg p-4 bg-gray-200 dark:bg-gray-700`}>
    <div className="text-md font-semibold dark:text-gray-100">{label}</div>
    <div className={`text-2xl font-bold dark:text-white`}>₹ {value.toLocaleString()}</div>
  </div>
);
