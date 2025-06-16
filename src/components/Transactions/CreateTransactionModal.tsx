import { useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../schemas/transactionSchema";
import type { TransactionSchema } from "../../schemas/transactionSchema";
import { useMutation } from '@tanstack/react-query';
import type { TransactionType } from '../../interfaces/transaction';
import { useEffect, useRef } from 'react';
import { createTransactionApi } from '../../services/api/transactionApi';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';


interface createTransactionModalProps {
    onClose: () => void;
    isModal: boolean;
}

interface categoryProps {
    category_id: string;
    category_name: string;
    category_type: 'income' | 'expense';
}

export const categories: categoryProps[] = [
    { category_id: '684c70ff0a8249c4fa8cff62', category_name: 'Salary', category_type: 'income' },
    { category_id: 'cat002', category_name: 'Freelance', category_type: 'income' },
    { category_id: 'cat003', category_name: 'Investments', category_type: 'income' },
    { category_id: 'cat004', category_name: 'Gift', category_type: 'income' },
    { category_id: 'cat005', category_name: 'Other Income', category_type: 'income' },

    { category_id: '6850501f749494f51d2ea194', category_name: 'Food', category_type: 'expense' },
    { category_id: 'cat007', category_name: 'Groceries', category_type: 'expense' },
    { category_id: 'cat008', category_name: 'Rent', category_type: 'expense' },
    { category_id: 'cat009', category_name: 'Utilities', category_type: 'expense' },
    { category_id: 'cat010', category_name: 'Transportation', category_type: 'expense' },
    { category_id: 'cat011', category_name: 'Travel', category_type: 'expense' },
    { category_id: 'cat012', category_name: 'Healthcare', category_type: 'expense' },
    { category_id: 'cat013', category_name: 'Insurance', category_type: 'expense' },
    { category_id: 'cat014', category_name: 'Entertainment', category_type: 'expense' },
    { category_id: '68505040749494f51d2ea197', category_name: 'Shopping', category_type: 'expense' },
    { category_id: 'cat016', category_name: 'Subscriptions', category_type: 'expense' },
    { category_id: 'cat017', category_name: 'Education', category_type: 'expense' },
    { category_id: 'cat018', category_name: 'Donations', category_type: 'expense' },
    { category_id: 'cat019', category_name: 'Personal Care', category_type: 'expense' },
    { category_id: 'cat020', category_name: 'Miscellaneous', category_type: 'expense' },
];

export const paymentApps = ['GPay', 'PhonePe', 'Paytm', 'AmazonPay', 'RazorPay', 'Other'];
export const sources = ['Cash', 'Bank Account', 'Other'];
export const status = ['Pending', 'Success', 'Failed'];
export const bankAccounts = ['ICICI'];

const CreateTransactionModal = ({ onClose, isModal }: createTransactionModalProps) => {

    const payment_sources = bankAccounts.length !== 0 ? sources : sources.filter((source) => source !== 'Bank Account');

    const queryClient = useQueryClient();

    useEffect(() => {
        return () => {
            controllerRef.current?.abort(); // Cancel if modal unmounts
        };
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<TransactionSchema>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            amount: 0,
            source: 'Cash',
            description: '',
            category_id: '',
            status: 'Pending',
            transaction_date: '',
            source_detail: undefined,
            payment_app: 'Other',
        }
    });

    const selectedSource = watch('source');
    const selectedCategoryId = watch('category_id');
    const selectedCategory = categories.find(cat => cat.category_id === selectedCategoryId);

    const controllerRef = useRef<AbortController | null>(null);

    const mutation = useMutation({
        mutationFn: async (data: TransactionType) => {
            //cancel previous mutation if running
            controllerRef.current?.abort();

            const controller = new AbortController();
            controllerRef.current = controller;

            return await createTransactionApi(data, controller?.signal);
        },
        onSuccess: () => {
            toast.success("Transaction added!");
            queryClient.invalidateQueries({ queryKey: ['transactions'] }); //Refetch the transactions
            reset();
            onClose();
        },
        onError: (err) => {
            toast.error("Failed to create transaction. Please try again.");
            console.error(err);
        },
    });

    const onSubmit = async (data: TransactionSchema) => {
        const transaction: TransactionType = {
            amount: data.amount,
            transaction_date: data.transaction_date,
            status: data.status,
            source: data.source,
            source_detail: data.source_detail ?? '',
            payment_app: data.payment_app,
            description: data.description,
            category_id: selectedCategory?.category_id ?? '',
            category_name: selectedCategory?.category_name ?? '',
            category_type: selectedCategory?.category_type ?? 'expense'
        }
        try {
            await mutation.mutateAsync(transaction);
        } catch (error) {
            console.error("Transaction mutation failed or was cancelled", error);
        }
    }

    const handleModalClose = () => {
        reset();
        onClose();
    }

    const handleWrapperClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === 'modal-wrapper') handleModalClose();
    };

    if (!isModal) return null;

    return (
        <div
            id="modal-wrapper"
            className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-80 z-50 p-4"
            onClick={handleWrapperClick}
        >
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-black dark:text-white text-xl font-medium">Create Transaction</h2>
                    <button onClick={handleModalClose} className="text-black dark:text-white text-2xl">
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="text-black dark:text-white block mb-1">Transaction Amount:</label>
                        <input
                            type="number"
                            {...register('amount', { valueAsNumber: true })}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 ${errors.amount ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                            placeholder="Enter transaction amount"
                        />
                        {errors.amount && (
                            <p className="text-red-400 text-sm">{errors.amount.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-black dark:text-white mb-1">Description:</label>
                        <input
                            type="text"
                            {...register('description')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.description ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                            placeholder="Enter description"
                        />
                        {errors.description && (
                            <p className="text-red-400 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-black dark:text-white mb-1">Transaction Date:</label>
                        <input
                            type="date"
                            {...register('transaction_date')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.transaction_date ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                        />
                        {errors.transaction_date && (
                            <p className="text-red-400 text-sm">{errors.transaction_date.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-black dark:text-white mb-1">Category:</label>
                        <select
                            {...register('category_id')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.category_id ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.category_name} ({cat.category_type})
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-400 text-sm">{errors.category_id.message}</p>}
                    </div>

                    <div>
                        <label className="block text-black dark:text-white mb-1">Status:</label>
                        <select
                            {...register('status')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.status ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                        >
                            <option value="">Select status</option>
                            {status.map((src) => (
                                <option key={src} value={src}>
                                    {src}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="text-red-400 text-sm">{errors.status.message}</p>}
                    </div>

                    <div>
                        <label className="block text-black dark:text-white mb-1">Source:</label>
                        <select
                            {...register('source')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.source ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                        >
                            <option value="">Select source <span>*(Add Banks in user section to select here)</span></option>
                            {payment_sources.map((src) => (
                                <option key={src} value={src}>
                                    {src}
                                </option>
                            ))}
                        </select>
                        {errors.source && <p className="text-red-400 text-sm">{errors.source.message}</p>}
                    </div>

                    {selectedSource === 'Bank Account' && (
                        <>
                            <div>
                                <label className="block text-black dark:text-white mb-1">Other Source Details:</label>
                                <select
                                    {...register('source_detail')}
                                    className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.source ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                        }`}
                                >
                                    <option value="">Select Bank</option>
                                    {bankAccounts.map((bnk) => (
                                        <option key={bnk} value={bnk}>
                                            {bnk}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-black dark:text-white mb-1">Payment App (optional):</label>
                                <select
                                    {...register('payment_app')}
                                    className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full"
                                >
                                    <option value="">Select app</option>
                                    {paymentApps.map((app) => (
                                        <option key={app} value={app}>
                                            {app}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {mutation.isPending ? 'Adding...' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTransactionModal;
