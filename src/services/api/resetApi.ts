import axiosInstance from "../axiosInstance";

export const sendForgotPassword = (email: string) =>
  axiosInstance.post("/secure/forgot-password", { email });

export const verifyOtp = (email: string, otp: string) =>
  axiosInstance.post("/secure/verify-otp", { email, otp });

export const resendOtp = (email: string) =>
  axiosInstance.post("/secure/verify-otp", { email });

export const resetPassword = (email: string, newPassword: string) =>
  axiosInstance.post("/secure/reset-password", { email, newPassword });
