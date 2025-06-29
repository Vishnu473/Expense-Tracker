import React from 'react';
import { FiChevronDown, FiFilter, FiSearch, FiX } from 'react-icons/fi';

interface TransactionFilters {
  search: string;
  category_type: string;
  fromDate: string;
  toDate: string;
  sortBy: 'amount' | 'transaction_date';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  showFilters: boolean;
  activeFiltersCount: number;
  onFilterChange: (key: keyof TransactionFilters, value: string | number) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  cardClasses: string;
  inputClasses: string;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  showFilters,
  activeFiltersCount,
  onFilterChange,
  onToggleFilters,
  onClearFilters,
  cardClasses,
  inputClasses
}) => {
  return (
    <section className={`${cardClasses} border rounded-lg p-6 mb-6`}
      aria-labelledby="transaction-filters"
      role="region">
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          aria-label="Search transactions"
          placeholder="Search transactions"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all`}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onToggleFilters}
          aria-expanded={showFilters}
          aria-controls="advanced-filters"
          aria-label="Toggle advanced filter options"
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <FiFilter className="w-4 h-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 dark:bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <FiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            aria-label="Clear all active filters"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-cyan-600 dark:hover:text-cyan-700 flex items-center space-x-1"
          >
            <FiX className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {showFilters && (
        <div id="advanced-filters" className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="category_type" className="block text-sm font-medium mb-2">Type</label>
              <select id="category_type"
                value={filters.category_type}
                onChange={(e) => onFilterChange('category_type', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500`}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="saving">Saving</option>
              </select>
            </div>

            <div>
              <label htmlFor="from-date" className="block text-sm font-medium mb-2">From Date</label>
              <input id="from-date"
                type="date"
                value={filters.fromDate}
                onChange={(e) => onFilterChange('fromDate', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500`}
              />
            </div>

            <div>
              <label htmlFor="to-date" className="block text-sm font-medium mb-2">To Date</label>
              <input id="to-date"
                type="date"
                value={filters.toDate}
                onChange={(e) => onFilterChange('toDate', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500`}
              />
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium mb-2">Sort By</label>
              <div className="flex space-x-2">
                <select id="sort-by"
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange('sortBy', e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500`}
                >
                  <option value="transaction_date">Date</option>
                  <option value="amount">Amount</option>
                </select>
                <button
                aria-label={`Change sort order to ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                  onClick={() => onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className={`px-3 py-2 rounded-lg border ${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors`}
                >
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default React.memo(TransactionFilters);