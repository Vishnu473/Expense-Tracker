import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';

export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await axiosInstance.get('/wallet/me');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};
