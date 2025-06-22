import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { getBankAccounts } from './services/api/bankApi';
import { useDispatch } from 'react-redux';
import { setBankAccounts } from './redux/slices/bankSlice';
import axiosInstance, { redirectToLogin } from './services/axiosInstance';
import { setCredentials } from './redux/slices/authSlice';
import { getAllCategories } from './services/api/categoryApi';
import { setCategories } from './redux/slices/categorySlice';

const AppRoutes = lazy(() => import('./routes/AppRoutes'));

function App() {
  const dispatch = useDispatch();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
  const initSession = async () => {
    try {
      const res = await axiosInstance.get('/user/me', { withCredentials: true });
      setSessionChecked(true);
      dispatch(setCredentials({ user: res.data.user }));

      const banks = await getBankAccounts();
      dispatch(setBankAccounts(banks));

      const categories = await getAllCategories();
      dispatch(setCategories(categories));
    } catch (err) {
      setSessionChecked(false);
      console.error("Session invalid or expired. Redirecting to login...");
      redirectToLogin();
    }
  };

  initSession();
}, []);
  if (!sessionChecked) return <div>🔐 Checking session...</div>;

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>⏳ Loading routes...</div>}>
          <AppRoutes />
        </Suspense>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
      </BrowserRouter>
    </>
  )
}

export default App
