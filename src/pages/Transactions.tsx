import React, { lazy, Suspense, useMemo, useState } from 'react';

import { useTransactions } from '../hooks/useTransactions';
import QuickSortButtons from '../components/Transactions/QuickSortButtons';
import TransactionTable from '../components/Transactions/TransactionTable';
import Pagination from '../components/Transactions/Pagination';
import { useTheme } from '../context/ThemeContext';
const CreateTransactionModal = lazy(() => import('../components/Transactions/CreateTransactionModal'));
import TransactionFilters from '../components/Transactions/TransactionFilters';

const Transactions: React.FC = () => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();

  const { themeClasses, cardClasses, inputClasses } = useMemo(() => {
    return {
      themeClasses: theme === "dark" ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900',
      cardClasses: theme === "dark" ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      inputClasses: theme === "dark" ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }
  }, [theme]);

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
      <div className={`min-h-screen ${themeClasses} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Transactions</h2>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses}`}>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  mb-4">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-fit"
            onClick={() => {
              setIsModal(true)
            }}>
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

        <QuickSortButtons
          filters={filters}
          onFilterChange={handleFilterChange}
          inputClasses={inputClasses}
        />

        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          isDarkMode={theme === 'dark'}
          cardClasses={cardClasses}
        />

        {pagination && (
          <Pagination
            pagination={pagination}
            currentPage={filters.page}
            onPageChange={handlePageChange}
            inputClasses={inputClasses}
          />
        )}
      </main>

      <Suspense fallback={null}>
        <CreateTransactionModal onClose={() => setIsModal(false)} isModal={isModal} />
      </Suspense>

    </div>
  );
};

export default Transactions;