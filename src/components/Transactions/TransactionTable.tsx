import React, { lazy } from 'react';
import { FixedSizeList as List } from 'react-window';

import TransactionRow from './TransactionRow';
import TransactionCard from './TransactionCard';
const TransactionCardSkeleton = lazy(()=>import ('../Skeletons/Transactions/TransactionCardSkeleton'));
const TransactionRowSkeleton = lazy(() => import ('../Skeletons/Transactions/TransactionRowSkeleton'));

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, '-');
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

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  cardClasses
}) => {

  return (
    <div className={`${cardClasses} border rounded-lg overflow-hidden`}
      aria-busy={isLoading} aria-live="polite">
      {isLoading ? (
        <>
          {/* Desktop Skeletons */}
          <div className={`transition-opacity duration-500 ease-in-out hidden lg:block overflow-x-auto ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-700 font-medium text-sm text-left px-6 py-4 border-b" role="row">
              <span role="columnheader">Date</span>
              <span role="columnheader">Category</span>
              <span role="columnheader">Description</span>
              <span role="columnheader">Amount</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Status</span>
            </div>
            <List height={400} itemCount={10} itemSize={60} width="100%">
              {({ index, style }) => <TransactionRowSkeleton style={style} key={index} />}
            </List>
          </div>

          {/* Mobile Skeletons */}
          <div className="lg:hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <TransactionCardSkeleton key={i} />
            ))}
          </div>
        </>

      ) : transactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4" role="status" aria-live="polite">No transactions found</p>
          <button aria-label='Add your first transaction' className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add your first transaction
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto" role="row">
            <div className="grid grid-cols-[1fr_1fr_3fr_1.5fr_1fr_1fr] bg-gray-50 dark:bg-gray-700 font-medium text-sm text-left px-6 py-4 border-b">
              <span role="columnheader">Date</span>
              <span role="columnheader">Category</span>
              <span role="columnheader">Description</span>
              <span role="columnheader">Amount</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Status</span>
            </div>
            <List
              height={Math.min(600, transactions.length * 60)}
              itemCount={transactions.length}
              itemSize={60}
              width="100%"
            >
              {({ index, style }) => (
                <TransactionRow
                  key={transactions[index]._id}
                  transaction={transactions[index]}
                  style={style}
                  formatDate={formatDate}
                  formatAmount={formatAmount}
                  getStatusColor={getStatusColor}
                  getTypeColor={getTypeColor}
                />
              )}
            </List>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {transactions.map(transaction => (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
                formatDate={formatDate}
                formatAmount={formatAmount}
                getTypeColor={getTypeColor}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        </>
      )}
    </div >
  );
};

export default TransactionTable;