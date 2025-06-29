import { useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../schemas/transactionSchema";
import type { TransactionSchema } from "../../schemas/transactionSchema";
import { useMutation } from '@tanstack/react-query';
import type { TransactionType } from '../../interfaces/transaction';
import { useEffect, useMemo, useRef } from 'react';
import { createTransactionApi } from '../../services/api/transactionApi';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';


interface createTransactionModalProps {
    onClose: () => void;
    isModal: boolean;
}

export const paymentApps = ['GPay', 'PhonePe', 'Paytm', 'AmazonPay', 'RazorPay', 'Other'];
export const sources = ['Cash', 'Bank Account', 'Other'];
export const status = ['Pending', 'Success', 'Failed'];

const CreateTransactionModal = ({ onClose, isModal }: createTransactionModalProps) => {

    const bankAccounts = useSelector((state: RootState) => state.bank.bankAccounts);
    const payment_sources = bankAccounts.length !== 0 ? sources : sources.filter((source) => source !== 'Bank Account');
    const categoriesList = useSelector((state:RootState) => state.category.categories);
    
    const queryClient = useQueryClient();

    useEffect(() => {
        const modal = document.getElementById('modal-wrapper');
        modal?.focus();

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleModalClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
            controllerRef.current?.abort();
        }
    }, []);

    const defaultValues = useMemo(() => ({
        amount: 0,
        source: 'Cash' as 'Cash' | 'Other' | 'Bank Account',
        description: '',
        category_id: '',
        status: 'Pending' as 'Pending' | 'Success' | 'Failed',
        transaction_date: '',
        source_detail: undefined,
        payment_app: 'Other' as 'Other' | 'GPay' | 'PhonePe' | 'Paytm' | 'AmazonPay' | 'RazorPay',
    }), []);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<TransactionSchema>({
        resolver: zodResolver(transactionSchema),
        defaultValues: defaultValues
    });

    const selectedSource = watch('source');
    const selectedCategoryId = watch('category_id');
    const selectedCategory = categoriesList.find(cat => cat._id === selectedCategoryId);

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
            category_id: selectedCategory?._id ?? '',
            category_name: selectedCategory?.name ?? '',
            category_type: selectedCategory?.type ?? 'expense'
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
                <div className="flex justify-between items-center mb-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title">
                    <h2 id="modal-title" className="text-black dark:text-white text-xl font-medium">Create Transaction</h2>
                    <button onClick={handleModalClose} className="text-black dark:text-white text-2xl">
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label htmlFor='amount' className="text-black dark:text-white block mb-1">Transaction Amount:</label>
                        <input
                            type="number"
                            id='amount'
                            autoFocus={true}
                            aria-invalid={!!errors.amount}
                            aria-describedby={errors.amount ? 'amount-error' : undefined}
                            {...register('amount', { valueAsNumber: true })}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 ${errors.amount ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                            placeholder="Enter transaction amount"
                        />
                        {errors.amount && (
                            <p id='amount-error' className="text-red-400 text-sm">{errors.amount.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor='description' className="block text-black dark:text-white mb-1">Description:</label>
                        <input id='description'
                            type="text"
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? 'description-error' : undefined}
                            {...register('description')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.description ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                            placeholder="Enter description"
                        />
                        {errors.description && (
                            <p id='description-error' className="text-red-400 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor='transaction_date' className="block text-black dark:text-white mb-1">Transaction Date:</label>
                        <input id='transaction_date'
                            type="date"
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? 'transaction_date-error' : undefined}
                            {...register('transaction_date')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.transaction_date ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                        />
                        {errors.transaction_date && (
                            <p id='transaction_date-error' className="text-red-400 text-sm">{errors.transaction_date.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor='category_id' className="block text-black dark:text-white mb-1">Category:</label>
                        <select id='category_id'
                            aria-invalid={!!errors.category_id}
                            aria-describedby={errors.category_id ? 'category_id-error' : undefined}
                            {...register('category_id')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.category_id ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                        >
                            <option value="">Select category</option>
                            {categoriesList.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name} ({cat.type})
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p id='category_id-error' className="text-red-400 text-sm">{errors.category_id.message}</p>}
                    </div>

                    <div>
                        <label htmlFor='status' className="block text-black dark:text-white mb-1">Status:</label>
                        <select id='status'
                            aria-invalid={!!errors.status}
                            aria-describedby={errors.status ? 'status-error' : undefined}
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
                        {errors.status && <p id='status-error' className="text-red-400 text-sm">{errors.status.message}</p>}
                    </div>

                    <div>
                        <label htmlFor='source' className="block text-black dark:text-white mb-1">Source:</label>
                        <select id='source'
                            {...register('source')}
                            aria-invalid={!!errors.source}
                            aria-describedby={errors.source ? 'source-error' : undefined}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-2 ${errors.source ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                        >
                            <option value="">Select source *Add Banks in user section to select here</option>
                            {payment_sources.map((src) => (
                                <option key={src} value={src}>
                                    {src}
                                </option>
                            ))}
                        </select>
                        {errors.source && <p id='source-error' className="text-red-400 text-sm">{errors.source.message}</p>}
                    </div>

                    {selectedSource === 'Bank Account' && (
                        <>
                            <div>
                                <label htmlFor='source_detail' className="block text-black dark:text-white mb-1">Other Source Details:</label>
                                <select id='source_detail'
                                    {...register('source_detail')}
                                    aria-invalid={!!errors.source_detail}
                                    aria-describedby={errors.source_detail ? 'source_detail-error' : undefined}
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
                                <label htmlFor='payment_app' className="block text-black dark:text-white mb-1">Payment App (optional):</label>
                                <select id='payment_app'
                                    {...register('payment_app')}
                                    aria-invalid={!!errors.payment_app}
                                    aria-describedby={errors.payment_app ? 'payment_app-error' : undefined}
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
                        <button role='button'
                            type="submit"
                            aria-busy={mutation.isPending}
                            aria-label={mutation.isPending ? 'Adding...' : 'Add Transaction'}
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
