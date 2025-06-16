import { useQuery } from '@tanstack/react-query';
import { fetchWalletSummary } from '../services/api/walletApi';

export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWalletSummary,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });
};
