import axiosInstance from "../axiosInstance";

export const fetchWalletSummary = async () => {
  const res = await axiosInstance.get('/wallet/summary');
  return res.data;
};