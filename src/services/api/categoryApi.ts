import type { CategorySchema } from '../../schemas/categorySchema';
import axiosInstance from '../axiosInstance';

export const getAllCategories = () =>
  axiosInstance.get('/category/getAll').then(res => res.data);

export const createCategory = (payload: { name: string; type: string }) => axiosInstance.post('/category/create', payload).then(res => res.data);
export const updateCategory = (id: string, payload: CategorySchema) => axiosInstance.put(`/category/${id}`, payload).then(res => res.data);
export const deleteCategory = (id: string) => axiosInstance.delete(`/category/${id}`).then(res => res.data.id);
