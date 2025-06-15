export interface TransactionType {
  _id: string;
  amount: number;
  source: string;
  source_detail: string;
  payment_app?: string;
  description: string;
  user: string;
  category_id: string;
  category_type: "income" | "expense";
  category_name: string;
  status: "Success" | "Pending" | "Failed";
  transaction_date: string;
  createdAt: string;
  updatedAt: string;
}
