import React, { useState } from 'react';

import { useTransactions } from '../hooks/useTransactions';
import QuickSortButtons from '../components/Transactions/QuickSortButtons';
import TransactionTable from '../components/Transactions/TransactionTable';
import Pagination from '../components/Transactions/Pagination';
import { useTheme } from '../context/ThemeContext';
import CreateTransactionModal from "../components/Transactions/CreateTransactionModal";
import TransactionFilters from '../components/Transactions/TransactionFilters';

const Transactions: React.FC = () => {
  const [isModal, setIsModal] = useState<Boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();

  const themeClasses = theme === "dark"
    ? 'bg-gray-800 text-white'
    : 'bg-gray-50 text-gray-900';

  const cardClasses = theme === "dark"
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const inputClasses = theme === "dark"
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  // Custom hooks
  const {
    filters,
    transactions,
    pagination,
    isLoading,
     error,
    activeFiltersCount,
    handleFilterChange,
    handlePageChange,
    clearFilters
   } = useTransactions();

  if (error) {
    return (
      <div className={`min-h-screen ${themeClasses}  flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Transactions</h2>
          <p className="text-gray-500">Please try again later</p>
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-fit"
            onClick={() => {
              setIsModal(true)
            }}>
            <span>New Transaction</span>
          </button>
        </div>
        <CreateTransactionModal onClose={() => setIsModal(false)} isModal={isModal} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses} `}>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Transactions</h1>
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-fit">
            <span>New Transaction</span>
          </button>
        </div>

        {/* Search and Filters */}
        <TransactionFilters
          filters={filters}
          showFilters={showFilters}
          activeFiltersCount={activeFiltersCount}
          onFilterChange={handleFilterChange}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={clearFilters}
          cardClasses={cardClasses}
          inputClasses={inputClasses}
        />

        {/* Quick Sort Buttons */}
        <QuickSortButtons
          filters={filters}
          onFilterChange={handleFilterChange}
          inputClasses={inputClasses}
        />

        {/* Transactions Table */}
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          isDarkMode={theme === 'dark'}
          cardClasses={cardClasses}
        />

        {/* Pagination */}
        {pagination && (
          <Pagination
            pagination={pagination}
            currentPage={filters.page}
            onPageChange={handlePageChange}
            inputClasses={inputClasses}
          />
        )}
      </main>


    </div>
  );
};

export default Transactions;