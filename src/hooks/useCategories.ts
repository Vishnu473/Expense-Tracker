import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../services/axiosInstance';
import { useDispatch } from 'react-redux';
import {
  setCategories,
  addCategory as addToStore,
  updateCategory as updateInStore,
  deleteCategory as deleteFromStore
} from '../redux/slices/categorySlice';
import type { CategorySchema } from '../schemas/categorySchema';

export const useCategories = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const getCategories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/category/getAll');
      dispatch(setCategories(res.data));
      return res.data;
    },
  });

  const createCategory = useMutation({
    mutationFn: async (data: CategorySchema) => {
      const res = await axios.post('/category/create', data);
      return res.data;
    },
    onSuccess: (newCategory) => {
      dispatch(addToStore(newCategory));
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const editCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategorySchema }) => {
      const res = await axios.put(`/category/${id}`, data);
      return res.data;
    },
    onSuccess: (updatedCategory) => {
      dispatch(updateInStore(updatedCategory));
      queryClient.invalidateQueries( {queryKey: ['categories']});
    },
  });

  const removeCategory = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/category/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      dispatch(deleteFromStore(deletedId));
      queryClient.invalidateQueries({queryKey: ['categories']});
    },
  });

  return { getCategories, createCategory, editCategory, removeCategory };
};