import type { PaginationData } from "../../components/Transactions/Pagination";
import type { TransactionFilters } from "../../components/Transactions/QuickSortButtons";
import type { Transaction } from "../../components/Transactions/TransactionTable";
import axiosInstance from "../axiosInstance";

export interface TransactionResponse {
  data: Transaction[];
  pagination: PaginationData;
}

export const fetchTransactions = async (filters: TransactionFilters): Promise<TransactionResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value.toString());
  });
  
  const response = await axiosInstance.get(`/transaction/getAll?${params.toString()}`);
  return response.data;
};