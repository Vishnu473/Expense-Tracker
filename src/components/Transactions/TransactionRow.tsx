import React from 'react';
import type { Transaction } from './TransactionTable';

interface TransactionRowProps {
  transaction: Transaction;
  style: React.CSSProperties;
  formatDate: (dateString: string) => string;
  formatAmount: (amount: number, type: 'income' | 'expense' | 'saving') => string;
  getStatusColor: (status: string) => string;
  getTypeColor: (type: 'income' | 'expense' | 'saving') => string;
}

const TransactionRow: React.FC<TransactionRowProps> = React.memo(({
  transaction,
  style,
  formatDate,
  formatAmount,
  getStatusColor,
  getTypeColor
}) => {
  return (
    <div
      style={style}
      className="grid grid-cols-[1fr_1fr_3fr_1.5fr_1fr_1fr] px-6 py-4 text-sm border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
    >
      <span>{formatDate(transaction.transaction_date)}</span>
      <span>{transaction.category_name}</span>
      <span className="text-gray-600 dark:text-gray-400 truncate block max-w-full mr-10">{transaction.description}</span>
      <span className={
        `font-medium ${
          transaction.category_type === 'income'
            ? 'text-green-600'
            : transaction.category_type === 'saving'
              ? 'text-blue-500'
              : 'text-red-600'
        }`
      }>
        {formatAmount(transaction.amount, transaction.category_type)}
      </span>
      <span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.category_type)}`}>
          {transaction.category_type === 'income'
            ? 'Income'
            : transaction.category_type === 'saving'
              ? 'Saving'
              : 'Expense'}
        </span>
      </span>
      <span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
          {transaction.status}
        </span>
      </span>
    </div>
  );
});

export default TransactionRow;
