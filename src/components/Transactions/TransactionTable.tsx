// components/TransactionTable.tsx
import React from 'react';

export interface Transaction {
  _id: string;
  transaction_date: string;
  category_name: string;
  description: string;
  amount: number;
  category_type: 'income' | 'expense' | 'saving';
  status: 'Pending' | 'Success' | 'Failed';
}

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isDarkMode: boolean;
  cardClasses: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  isDarkMode,
  cardClasses
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatAmount = (amount: number, type: 'income' | 'expense' | 'saving') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
    
    if (type === 'income') {
      return `+${formatted}`;
    }
    return `-${formatted}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: 'income' | 'expense' | 'saving') => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'saving':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'expense':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <div className={`${cardClasses} border rounded-lg overflow-hidden`}>
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4">No transactions found</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add your first transaction
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-sm">Date</th>
                  <th className="text-left px-6 py-4 font-medium text-sm">Category</th>
                  <th className="text-left px-6 py-4 font-medium text-sm">Description</th>
                  <th className="text-left px-6 py-4 font-medium text-sm">Amount</th>
                  <th className="text-left px-6 py-4 font-medium text-sm">Type</th>
                  <th className="text-left px-6 py-4 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction: Transaction) => (
                  <tr key={transaction._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {transaction.category_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.description}
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${
                      transaction.category_type === 'income' ? 'text-green-600' : transaction.category_type === 'saving' ? 'text-blue-500' : 'text-red-600'
                    }`}>
                      {formatAmount(transaction.amount, transaction.category_type)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.category_type)}`}>
                        {transaction.category_type === 'income' ? 'Income' : (transaction.category_type === 'saving' ? 'Saving' : 'Expense')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {transactions.map((transaction: Transaction) => (
              <div key={transaction._id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{transaction.category_name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.category_type === 'income' ? 'text-green-600' : transaction.category_type === 'saving' ? 'text-blue-500' : 'text-red-600'
                    }`}>
                      {formatAmount(transaction.amount, transaction.category_type)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.category_type)}`}>
                    {transaction.category_type === 'income' ? 'Income' : (transaction.category_type === 'saving' ? 'Saving' : 'Expense')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionTable;