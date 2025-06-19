import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";

export const useGetSavings = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['savings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/saving/getAll');
      return data;
    },
    refetchOnWindowFocus: false,
  });
  return { data, isLoading, error, refetch };
};
