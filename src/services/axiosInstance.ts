import axios from 'axios';
let isRefreshing = false;
let isRedirecting = false; // NEW

export const redirectToLogin = async () => {
  if (isRedirecting) return;
  isRedirecting = true;

  console.log("🔒 Logging out...");

  try {
    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/logout`, {
      withCredentials: true,
    });
    console.log("✅ Logout API called");
  } catch (err) {
    console.error("❌ Failed to call logout API", err);
  }

  localStorage.clear();

  // setTimeout(() => {
  //   window.location.href = '/login';
  // }, 100);
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    console.log("Original Request was stored");
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Got 401 Error - no token / should call refresh");
      
      originalRequest._retry = true;

      if (isRefreshing) return Promise.reject(error);
      isRefreshing = true;

      try {
        console.log("Calling refresh API..");
        
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