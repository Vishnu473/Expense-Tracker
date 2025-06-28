import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser, updateUser } from '../services/api/userApi';

export const useUser = () => useQuery({ queryKey: ['user'], queryFn: getUser });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  });
  return {
    ...mutation,
    isPending: mutation.status === 'pending',
  };
};
