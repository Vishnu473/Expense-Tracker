import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';

// Generic fetcher
const fetchAnalytics = async (url: string) => {
  const { data } = await axiosInstance.get(url);
  return data;
};

export const useMonthlyTrendAnalytics = () =>
  useQuery({
    queryKey: ['monthly-trend'],
    queryFn: () => fetchAnalytics('/analytics/monthly-trend'),
  });

// export const useCategoryExpenseAnalytics = () =>
//   useQuery({
//     queryKey: ['category-expense'],
//     queryFn: () => fetchAnalytics('/analytics/expenses-by-category'),
//   });

// export const useSourceSpendingAnalytics = () =>
//   useQuery({
//     queryKey: ['source-spending'],
//     queryFn: () => fetchAnalytics('/analytics/spending-by-source'),
//   });

// export const usePaymentAppAnalytics = () =>
//   useQuery({
//     queryKey: ['payment-app-usage'],
//     queryFn: () => fetchAnalytics('/analytics/payment-app-usage'),
//   });

// export const useSavingsProgressAnalytics = () =>
//   useQuery({
//     queryKey: ['savings-progress'],
//     queryFn: () => fetchAnalytics('/analytics/saving-progress'),
//   });

export const useFinancialOverviewAnalytics = () =>
  useQuery({
    queryKey: ['financial-overview'],
    queryFn: () => fetchAnalytics('/analytics/financial-overview'),
  });

// export const useBalanceGrowthAnalytics = () =>
//   useQuery({
//     queryKey: ['balance-growth'],
//     queryFn: () => fetchAnalytics('/analytics/balance-growth'),
//   });
