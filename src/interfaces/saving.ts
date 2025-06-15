export interface Saving {
  _id: string;
  user: string;
  source: string;
  source_detail: string;
  payment_app: string;
  purpose: string;
  is_completed: boolean;
  current_amount: number;
  amount: number;
  expected_at: string;
  transaction_date: string;
  createdAt: string;
  updatedAt: string;
  pic?: string;
}
