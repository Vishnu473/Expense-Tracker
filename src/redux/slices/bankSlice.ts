import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface BankState {
  bankAccounts: string[];
}

const initialState: BankState = {
  bankAccounts: [],
};

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    setBankAccounts: (state, action: PayloadAction<string[]>) => {
      state.bankAccounts = action.payload;
    },
    addBankAccount: (state, action: PayloadAction<string>) => {
      state.bankAccounts.push(action.payload);
    },
    renameBankAccount: (state, action: PayloadAction<{ oldName: string; newName: string }>) => {
      const index = state.bankAccounts.findIndex(acc => acc === action.payload.oldName);
      if (index !== -1) state.bankAccounts[index] = action.payload.newName;
    },
    deleteBankAccount: (state, action: PayloadAction<string>) => {
      state.bankAccounts = state.bankAccounts.filter(acc => acc !== action.payload);
    },
    clearBankAccounts: (state) => {
      state.bankAccounts = [];
    },
  },
});

export const {
  setBankAccounts,
  addBankAccount,
  renameBankAccount,
  deleteBankAccount,
  clearBankAccounts
} = bankSlice.actions;

export default bankSlice.reducer;