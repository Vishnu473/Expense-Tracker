import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";

export const useGetSavings = () => {
  return useQuery({
    queryKey: ['savings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/saving/getAll');
      return data;
    },
  });
};
