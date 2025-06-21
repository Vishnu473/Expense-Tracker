import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { getBankAccounts } from './services/api/bankApi';
import { useDispatch, useSelector } from 'react-redux';
import { setBankAccounts } from './redux/slices/bankSlice';
import type { RootState } from './redux/store';
import axiosInstance from './services/axiosInstance';
import { setCredentials } from './redux/slices/authSlice';

const AppRoutes = lazy(() => import('./routes/AppRoutes'));

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const hasCookie = document.cookie.includes('accessToken');
        if (!hasCookie) {
          console.log("No token so silent return from App.tsx");
          setSessionChecked(true);
          return;
        }
        console.log("Has token so calling user/me....");

        const res = await axiosInstance.get('/user/me', { withCredentials: true });
        if (!user) {
          dispatch(setCredentials({ user: res.data.user }));
          console.log("User set to redux, now setting bank accounts");
          const banks = await getBankAccounts();
          dispatch(setBankAccounts(banks));
        }

      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setSessionChecked(true);
      }
    };

    initSession();
  }, [dispatch]);

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
