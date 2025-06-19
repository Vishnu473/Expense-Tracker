import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';
import { getBankAccounts } from './services/api/bankApi';
import { useDispatch, useSelector } from 'react-redux';
import { setBankAccounts } from './redux/slices/bankSlice';
import type { RootState } from './redux/store';

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      getBankAccounts().then(banks => {
        dispatch(setBankAccounts(banks));
      });
    }
  }, [token, dispatch]);

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
      </BrowserRouter>
    </>
  )
}

export default App
