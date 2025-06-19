import type { ProfileForm } from "../../schemas/profileSchema";
import axiosInstance from "../axiosInstance";

export const getUser = () => axiosInstance.get('/user/me').then(res => res.data);
export const updateUser = (payload: ProfileForm) => axiosInstance.patch('/user/update', payload);