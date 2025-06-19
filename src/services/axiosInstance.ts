import axios from 'axios';

export const redirectToLogin = () => {
  console.log("Logging Out......");
  localStorage.clear();
  setTimeout(() => {
    window.location.href = '/login';
  }, 5000);
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async(error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.get('/user/auth/refresh', { withCredentials: true });
        return axios(originalRequest); // Retry failed request
      } catch (refreshErr) {
        console.error('Refresh failed → logging out');
        redirectToLogin();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;