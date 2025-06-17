// hooks/useTransactions.ts
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../services/api/transactionApi';
import type { TransactionFilters } from '../components/Transactions/QuickSortButtons';

export const useTransactions = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    category_type: '',
    fromDate: '',
    toDate: '',
    sortBy: 'transaction_date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  // React Query for fetching transactions
  const { data: transactionsData, isLoading, error, refetch } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => fetchTransactions(filters),
    refetchOnMount: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const transactions = transactionsData?.data || [];
  const pagination = transactionsData?.pagination;

  const handleFilterChange = (key: keyof TransactionFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category_type: '',
      fromDate: '',
      toDate: '',
      sortBy: 'transaction_date',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category_type) count++;
    if (filters.fromDate) count++;
    if (filters.toDate) count++;
    return count;
  }, [filters]);

  return {
    filters,
    transactions,
    pagination,
    isLoading,
    error,
    activeFiltersCount,
    handleFilterChange,
    handlePageChange,
    clearFilters, 
    refetch
  };
};