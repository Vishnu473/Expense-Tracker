import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const loadFromStorage = () => {
  try {
    const stateStr = localStorage.getItem("authstate");
    return stateStr ? JSON.parse(stateStr) : undefined;
  } catch (error) {
    return undefined;
  }
}

const saveToStorage = (state:any) => {
  try {
    localStorage.setItem("authstate",JSON.stringify(state));
  } catch (error) {
    
  }
}

export const store = configureStore({
  reducer: {
    auth:authReducer
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
