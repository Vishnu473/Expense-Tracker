import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { queryClient } from '../lib/reactQueryClient';

export const handleLogoutUser = async () => {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/logout`, {
      credentials: 'include',
    });
  } catch (err) {
    console.warn("Logout API failed", err);
  }

  store.dispatch(logout());
  localStorage.clear();
};



export const clearQueryClient = () => {
  queryClient.clear();
};
