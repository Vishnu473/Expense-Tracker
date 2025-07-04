export interface TransactionType {
  amount: number;
  source: string;
  source_detail: string;
  payment_app?: string;
  description: string;
  category_id: string;
  category_type: "income" | "expense" | "saving";
  category_name: string;
  status: "Success" | "Pending" | "Failed";
  transaction_date: string;
}
