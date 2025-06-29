import React from 'react';
import type { Transaction } from './TransactionTable';

interface TransactionCardProps {
  transaction: Transaction;
  formatDate: (dateString: string) => string;
  formatAmount: (amount: number, type: 'income' | 'expense' | 'saving') => string;
  getStatusColor: (status: string) => string;
  getTypeColor: (type: 'income' | 'expense' | 'saving') => string;
}

const TransactionCard: React.FC<TransactionCardProps> = React.memo(({
  transaction,
  formatDate,
  formatAmount,
  getStatusColor,
  getTypeColor
}) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
       role="group"
       aria-label={`Transaction of ${formatAmount(transaction.amount, transaction.category_type)} for ${transaction.category_name}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="max-w-[70%] sm:max-w-[80%]">
          <h3 className="font-medium text-xs md:text-sm">{transaction.category_name}</h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{transaction.description}</p>
        </div>

        <div className="text-right">
          <p className={`font-medium text-xs md:text-sm ${transaction.category_type === 'income'
              ? 'text-green-600'
              : transaction.category_type === 'saving'
                ? 'text-blue-500'
                : 'text-red-600'
            }`}>
            {formatAmount(transaction.amount, transaction.category_type)}
          </p>
          <p className="text-xs md:text-sm text-gray-500">{formatDate(transaction.transaction_date)}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-md text-xs md:text-sm font-medium ${getTypeColor(transaction.category_type)}`}>
          {transaction.category_type === 'income' ? 'Income' : (transaction.category_type === 'saving' ? 'Saving' : 'Expense')}
        </span>
        <span className={`px-2 py-1 rounded-md text-xs md:text-sm font-medium ${getStatusColor(transaction.status)}`}>
          {transaction.status}
        </span>
      </div>
    </div>
  );
});

export default TransactionCard;