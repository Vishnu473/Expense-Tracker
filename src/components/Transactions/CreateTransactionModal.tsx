import { useState } from "react";
import { useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../schemas/transactionSchema";
import type { TransactionSchema } from "../../schemas/transactionSchema";

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
    { category_id: 'cat001', category_name: 'Salary', category_type: 'income' },
    { category_id: 'cat002', category_name: 'Freelance', category_type: 'income' },
    { category_id: 'cat003', category_name: 'Investments', category_type: 'income' },
    { category_id: 'cat004', category_name: 'Gift', category_type: 'income' },
    { category_id: 'cat005', category_name: 'Other Income', category_type: 'income' },

    { category_id: 'cat006', category_name: 'Food & Dining', category_type: 'expense' },
    { category_id: 'cat007', category_name: 'Groceries', category_type: 'expense' },
    { category_id: 'cat008', category_name: 'Rent', category_type: 'expense' },
    { category_id: 'cat009', category_name: 'Utilities', category_type: 'expense' },
    { category_id: 'cat010', category_name: 'Transportation', category_type: 'expense' },
    { category_id: 'cat011', category_name: 'Travel', category_type: 'expense' },
    { category_id: 'cat012', category_name: 'Healthcare', category_type: 'expense' },
    { category_id: 'cat013', category_name: 'Insurance', category_type: 'expense' },
    { category_id: 'cat014', category_name: 'Entertainment', category_type: 'expense' },
    { category_id: 'cat015', category_name: 'Shopping', category_type: 'expense' },
    { category_id: 'cat016', category_name: 'Subscriptions', category_type: 'expense' },
    { category_id: 'cat017', category_name: 'Education', category_type: 'expense' },
    { category_id: 'cat018', category_name: 'Donations', category_type: 'expense' },
    { category_id: 'cat019', category_name: 'Personal Care', category_type: 'expense' },
    { category_id: 'cat020', category_name: 'Miscellaneous', category_type: 'expense' },
];

export const paymentApps = ['GPay', 'PhonePe', 'Paytm', 'AmazonPay', 'RazorPay'];
export const sources = ['Cash', 'Bank Account', 'others'];
export const status = ['Pending', 'Success', 'Failed'];

const CreateTransactionModal = ({ onClose, isModal }: createTransactionModalProps) => {
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
            category_type: 'expense',
            category_name: '',
            status: 'Pending',
            transaction_date: '',
            source_detail: '',
            payment_app: 'Other',
        }
    });

    const onsubmit = async (data: TransactionSchema) => {
        console.log(data);
        console.log(selectedCategory);
        reset();
        onClose();
    }

    const selectedSource = watch('source');
    const selectedCategoryId = watch('category_id');
    const selectedCategory = categories.find(cat => cat.category_id === selectedCategoryId);

    if (!isModal) return null;

    const handleModalClose = () => {
        reset();
        onClose();
    }

    const handleWrapperClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === 'modal-wrapper') handleModalClose();
    };

    return (
        <div
            id="modal-wrapper"
            className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-80 z-50 p-4"
            onClick={handleWrapperClick}
        >
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-black dark:text-white text-xl font-medium">Create Transaction</h2>
                    <button onClick={handleModalClose} className="text-white text-2xl">
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onsubmit)} className="space-y-5">
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
                            <option value="">Select source</option>
                            {sources.map((src) => (
                                <option key={src} value={src}>
                                    {src}
                                </option>
                            ))}
                        </select>
                        {errors.source && <p className="text-red-400 text-sm">{errors.source.message}</p>}
                    </div>

                    {selectedSource === 'Bank Account' && (
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
                    )}

                    {selectedSource === 'others' && (
                        <div>
                            <label className="block text-black dark:text-white mb-1">Other Source Details (optional):</label>
                            <input
                                type="text"
                                {...register('source_detail')}
                                className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full"
                                placeholder="Enter source details"
                            />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg"
                        >
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTransactionModal;
