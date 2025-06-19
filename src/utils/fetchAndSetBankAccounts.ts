import { getBankAccounts } from "../services/api/bankApi";
import { setBankAccounts } from "../redux/slices/bankSlice";
import type { AppDispatch } from "../redux/store";

export const fetchAndSetBankAccounts = async (dispatch: AppDispatch) => {
  try {
    const banks = await getBankAccounts();
    dispatch(setBankAccounts(banks));
  } catch (error) {
    console.error("Failed to fetch bank accounts:", error);
  }
};
