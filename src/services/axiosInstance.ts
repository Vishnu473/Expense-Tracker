import axios from 'axios';
import { clearQueryClient, handleLogoutUser } from '../utils/handleLogOutUser';
import { toast } from 'react-toastify';

let isRefreshing = false;

export const redirectToLogin = async () => {
  if (sessionStorage.getItem("redirectedOnce")) return;

  sessionStorage.setItem("redirectedOnce", "true");
  
  toast.info("Session expired. Logging out...");
  await handleLogoutUser();
  clearQueryClient();

  // Let toast show for 1 second, then replace
  setTimeout(() => {
    window.location.replace("/login");
  }, 1000);
};


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/user/auth/refresh')
    ) {
      originalRequest._retry = true;
      
      
      if (isRefreshing) return Promise.reject(error);
      isRefreshing = true;

      try {
        await axiosInstance.get('/user/auth/refresh');
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.log("Refresh Error.....");
        // if(!sessionStorage.getItem("redirectedOnce")){
          await redirectToLogin();
        // }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
