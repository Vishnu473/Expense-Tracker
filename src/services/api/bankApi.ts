import axiosInstance from '../axiosInstance';

export const getBankAccounts = () =>
  axiosInstance.get('/user/payment-sources').then(res => res.data.bankAccounts);

export const deleteBankAccount = (name: string) =>
  axiosInstance.delete('/user/bank-account', { data: { name } });

export const renameBankAccount = (oldName: string, newName: string) =>
  axiosInstance.post('/user/bank-account/rename', { oldName, newName });

export const addBankAccount = (name: string) =>
  axiosInstance.post('/user/bank-account', { name });