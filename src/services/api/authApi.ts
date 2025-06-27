import type { LoginSchema } from "../../schemas/loginSchema";
import type { RegisterSchema } from "../../schemas/registerSchema";
import axiosInstance from "../axiosInstance";

export const loginUser = (data:LoginSchema) => axiosInstance.post("/user/login",data);
export const registerUser = (data:RegisterSchema) => axiosInstance.post("/user/register",data);
export const logoutApi = async () => {
  return axiosInstance.get('/user/logout');
};