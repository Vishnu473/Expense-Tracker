import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Please enter a valid positive amount').default(0),

  source: z.enum(['Cash', 'Bank Account', 'others'], {
    required_error: 'Please select a source for the transaction',
  }),

  source_detail: z
    .string()
    .max(100, 'Source detail must be under 100 characters')
    .optional(),

  payment_app: z
    .enum(['PhonePe', 'GPay', 'AmazonPay', 'Paytm', 'RazorPay','Other'])
    .optional(),

  description: z
    .string()
    .min(1, 'Please provide a short description for the transaction'),

  category_id: z
    .string({ required_error: 'Please select a category' }),

  transaction_date: z
    .string({ required_error: 'Please select a date for the transaction' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format. Please choose a valid date.',
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: 'Transaction date cannot be in the future',
    }),

  status: z.enum(['Pending', 'Success', 'Failed']).default('Pending'),
})
  .refine(
    (data) => {
      if (data.source === 'others') {
        return !!data.source_detail?.trim();
      }
      return true;
    },
    {
      message: 'Please enter the source detail when source is set to "others"',
      path: ['source_detail'],
    }
  );

export type TransactionSchema = z.infer<typeof transactionSchema>;
