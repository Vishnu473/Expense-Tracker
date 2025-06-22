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
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  currentPage,
  onPageChange,
  inputClasses
}) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const startItem = ((pagination.currentPage - 1) * pagination.limit) + 1;
  const endItem = Math.min(pagination.currentPage * pagination.limit, pagination.totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startItem} to {endItem} of {pagination.totalCount} transactions
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
            pagination.hasPrevPage
              ? `${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600`
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
          }`}
        >
          Previous
        </button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  pageNum === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : `${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600`
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
            pagination.hasNextPage
              ? `${inputClasses} hover:bg-gray-50 dark:hover:bg-gray-600`
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default React.memo(Pagination);