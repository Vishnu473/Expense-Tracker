import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { getBankAccounts } from './services/api/bankApi';
import { useDispatch, useSelector } from 'react-redux';
import { setBankAccounts } from './redux/slices/bankSlice';
import axiosInstance, { redirectToLogin } from './services/axiosInstance';
import { setCredentials } from './redux/slices/authSlice';
import { getAllCategories } from './services/api/categoryApi';
import { setCategories } from './redux/slices/categorySlice';
import type { RootState } from './redux/store';

const AppRoutes = lazy(() => import('./routes/AppRoutes'));


function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      if (!user) {
        setSessionChecked(true);
        return;
      }

      try {

        const res = await axiosInstance.get('/user/me', { withCredentials: true });
        dispatch(setCredentials({ user: res.data.user }));

        const banks = await getBankAccounts();
        dispatch(setBankAccounts(banks));

        const categories = await getAllCategories();
        dispatch(setCategories(categories));
      } catch (err) {
        console.log(sessionStorage.getItem("redirectedOnce"));

        if (!sessionStorage.getItem("redirectedOnce")) {
          console.error("Session invalid or expired. Redirecting to login...");
          await redirectToLogin();
        }

      }
      finally {
        setSessionChecked(true);
      }
    };

    initSession();
  }, []);

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <span aria-busy="true">🔐 Validating session, please wait...</span>
      </div>
    );
  }


  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>⏳ Loading routes...</div>}>
          <AppRoutes />
        </Suspense>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          role="alert"
          aria-live="assertive"
        />
      </BrowserRouter>
    </>
  )
}

export default App
