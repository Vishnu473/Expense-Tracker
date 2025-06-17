export interface Saving {
  _id?: string;
  user: string;
  isNew?:boolean;
  source: 'Cash' | 'Bank Account' | 'Other';
  source_detail?: string;
  payment_app?:  'GPay' | 'PhonePe' | 'Paytm' | 'AmazonPay' | 'RazorPay' | 'Other';
  purpose: string;
  is_completed?: boolean;
  current_amount: number;
  amount: number;
  expected_at: string;
  transaction_date: string;
  pic?: string;
}
