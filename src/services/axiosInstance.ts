import axios from 'axios';
import { useNavigate } from 'react-router-dom';
let isRefreshing = false;
let isRedirecting = false; // NEW

export const redirectToLogin = async () => {
  const navigate = useNavigate();
  if (isRedirecting) return;
  isRedirecting = true;

  try {
    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/logout`, {
      withCredentials: true,
    });
  } catch (err) {
    console.error("❌ Failed to call logout API", err);
  }

  localStorage.clear();

  navigate("/login");
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      originalRequest._retry = true;

      if (isRefreshing) return Promise.reject(error);
      isRefreshing = true;

      try {
        await axiosInstance.get('/user/auth/refresh', { withCredentials: true });
        isRefreshing = false;
        return axios(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        console.error("Refresh failed, redirecting...");
        await redirectToLogin();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;