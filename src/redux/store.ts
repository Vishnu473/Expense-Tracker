import { configureStore } from '@reduxjs/toolkit';
import authReducer, { type AuthState } from './slices/authSlice';
import bankReducer from './slices/bankSlice';
import categoryReducer from './slices/categorySlice';

const loadFromStorage = () => {
  try {
    const stateStr = localStorage.getItem("authstate");
    return stateStr ? JSON.parse(stateStr) : undefined;
  } catch (error) {
    return undefined;
  }
}

const saveToStorage = (state: AuthState) => {
  try {
    const { user } = state;
    if (user) {
      const minimalUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
      localStorage.setItem("authstate", JSON.stringify({ user: minimalUser }));
    }
  } catch (error) {
    console.error("Failed to set the localStorage");
  }
};

export const store = configureStore({
  reducer: {
    auth:authReducer,
    bank:bankReducer,
    category: categoryReducer,
  },
  preloadedState:{
    auth:loadFromStorage(),
  }
});

store.subscribe(() => {
  saveToStorage(store.getState().auth);
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
