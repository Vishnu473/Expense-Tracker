import axiosInstance from '../axiosInstance';

export const getAllCategories = () =>
  axiosInstance.get('/category/getAll').then(res => res.data);
export const createCategory = (payload: { name: string; type: string }) => axiosInstance.post('/category/create', payload);
export const updateCategory = (id: string, payload: { name: string; type: string }) => axiosInstance.put(`/category/${id}`, payload);
export const deleteCategory = (id: string) => axiosInstance.delete(`/category/${id}`);
