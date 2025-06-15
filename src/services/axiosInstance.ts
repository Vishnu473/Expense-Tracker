import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // for cookie-based JWT
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // optional: add toast or redirect on auth error
    console.log("Error inside AxiosInstance: ",error);
    return Promise.reject(error);
  }
);

export default axiosInstance;