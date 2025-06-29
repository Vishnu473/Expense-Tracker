import React from 'react';

export interface TransactionFilters {
  search: string;
  category_type: string;
  fromDate: string;
  toDate: string;
  sortBy: 'amount' | 'transaction_date';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

interface QuickSortButtonsProps {
  filters: TransactionFilters;
  onFilterChange: (key: keyof TransactionFilters, value: string | number) => void;
  inputClasses: string;
}

const QuickSortButtons: React.FC<QuickSortButtonsProps> = ({
  filters,
  onFilterChange,
  inputClasses
}) => {
  const handleDateSort = () => {
    onFilterChange('sortBy', 'transaction_date');
    onFilterChange('sortOrder', 'desc');
  };

  const handleAmountSort = () => {
    onFilterChange('sortBy', 'amount');
    onFilterChange('sortOrder', 'desc');
  };

  return (
    <section aria-label="Quick sort options"
      role="region" className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={handleDateSort}
        aria-pressed={filters.sortBy === 'transaction_date' && filters.sortOrder === 'desc'}
        aria-label="Sort by transaction date descending"
        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
          filters.sortBy === 'transaction_date' && filters.sortOrder === 'desc'
            ? 'bg-blue-600 dark:bg-cyan-600 text-white dark:border-cyan-600 border-blue-600'
            : `${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600`
        }`}
      >
        Date ↓
      </button>
      <button
        onClick={handleAmountSort}
        aria-pressed={filters.sortBy === 'amount' && filters.sortOrder === 'desc'}
        aria-label="Sort by amount descending"
        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
          filters.sortBy === 'amount' && filters.sortOrder === 'desc'
            ? 'bg-blue-600 dark:bg-cyan-600 text-white dark:border-cyan-600 border-blue-600'
            : `${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600`
        }`}
      >
        Amount ↓
      </button>
    </section>
  );
};

export default React.memo(QuickSortButtons);