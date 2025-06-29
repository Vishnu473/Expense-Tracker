import React from 'react';

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
  inputClasses: string;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  currentPage,
  onPageChange,
  inputClasses,
  maxVisiblePages
}) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const startItem = ((pagination.currentPage - 1) * pagination.limit) + 1;
  const endItem = Math.min(pagination.currentPage * pagination.limit, pagination.totalCount);
  const pageLimit = maxVisiblePages ?? 5;
  const visiblePages = Array.from({ length: Math.min(pageLimit, pagination.totalPages) }, (_, i) => i + 1);

  return (
    <nav role="navigation"
      aria-label="Pagination Navigation"
      className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
      <div className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Showing {startItem} to {endItem} of {pagination.totalCount} transactions
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Go to previous page"
          disabled={!pagination.hasPrevPage}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-500 ${pagination.hasPrevPage
              ? `${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600`
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
            }`}
        >
          Previous
        </button>

        <div className="flex items-center space-x-1" role="group" aria-label="Page number navigation">
          {visiblePages.map((pageNum) => (
            <button
              key={pageNum}
              aria-current={pageNum === currentPage ? 'page' : undefined}
              aria-label={`Go to page ${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-500 ${pageNum === pagination.currentPage
                  ? 'bg-blue-600 text-white'
                  : `${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600`
                }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Go to next page"
          disabled={!pagination.hasNextPage}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-500 ${pagination.hasNextPage
              ? `${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600`
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
            }`}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default React.memo(Pagination);