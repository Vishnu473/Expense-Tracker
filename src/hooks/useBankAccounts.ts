import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addBankAccount, deleteBankAccount, getBankAccounts, renameBankAccount } from '../services/api/bankApi';

export const useBankAccounts = () =>
  useQuery({ queryKey: ['bank-accounts'], queryFn: getBankAccounts });

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => deleteBankAccount(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bank-accounts'] }),
  });
};

export const useRenameBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ oldName, newName }: { oldName: string; newName: string }) => renameBankAccount(oldName, newName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bank-accounts'] }),
  });
};

export const useAddBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => addBankAccount(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bank-accounts'] }),
  });
};