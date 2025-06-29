import { FiX } from "react-icons/fi"
import { createSavingSchema, type CreateSavingSchema } from "../../schemas/savingSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Saving } from "../../interfaces/saving";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createSaving, uploadImage } from "../../services/api/savingApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export const paymentApps = ['GPay', 'PhonePe', 'Paytm', 'AmazonPay', 'RazorPay', 'Other'];
export const sources = ['Cash', 'Bank Account', 'Other'];
export const status = ['Pending', 'Success', 'Failed'];


const CreateSavingModal = ({ isCreateModal, closeModal }: { isCreateModal: boolean, closeModal: () => void }) => {
    const queryClient = useQueryClient();

    const bankAccounts = useSelector((state: RootState) => state.bank.bankAccounts);
    const [imageUploaded, setImageUploaded] = useState<Boolean>(false);
    const [newPreviewImageUrl, setNewPreviewImageUrl] = useState<string>('');
    const [newImageUrl, setNewImageUrl] = useState<string>('');

    const payment_sources = useMemo(() => (
        bankAccounts.length !== 0 ? sources : sources.filter((src) => src !== "Bank Account")
    ), [bankAccounts]);

    useEffect(() => {
        return () => {
            abortcontrollerRef?.current?.abort();
        }
    }, []);

    const abortcontrollerRef = useRef<AbortController | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<CreateSavingSchema>({
        resolver: zodResolver(createSavingSchema),
        defaultValues: {
            source: 'Cash',
            source_detail: '',
            payment_app: 'Other',
            amount: 0,
            expected_at: '',
            purpose: '',
            pic: '',
            isNew: false,
            is_completed: false,
        },
    });

    const selectedSource = watch('source');

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setNewPreviewImageUrl(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append("file", file); // Use 'image' as expected by backend

        console.log([...formData]);

        try {
            const url = await uploadImage(formData);
            setNewImageUrl(url);
            setImageUploaded(true);
        } catch {
            setImageUploaded(false);
            setNewPreviewImageUrl('');
            toast.error('Image upload failed');
        }
    };

    const savingMutation = useMutation({
        mutationFn: async (data: Saving) => {
            abortcontrollerRef?.current?.abort();

            const controller = new AbortController();
            abortcontrollerRef.current = controller;

            return await createSaving(data, controller?.signal);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['savings'] });
            toast.success("Successfully created a saving goal.");
            handleClose();
        },
        onError: (err) => {
            toast.error("Failed to create saving goal. Please try again.");
            console.error(err);
        }
    }
    )

    const handleClose = () => {
        newPreviewImageUrl ? setNewPreviewImageUrl('') : '';
        reset();
        closeModal();
    }

    const handleWrapperClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === "modal-wrapper") {
            handleClose();
        }
    }

    if (!isCreateModal) return null;

    const onSubmit = async (data: CreateSavingSchema) => {
        console.log(data);
        const today = new Date();
        const newSaving: Saving = {
            ...data,
            is_completed: false,
            user: '',
            pic: newImageUrl,
            transaction_date: today.toISOString().split('T')[0],
            current_amount: 0
        };
        console.log(newSaving);

        try {
            await savingMutation.mutateAsync(newSaving);
        } catch (error) {
            console.error("Saving mutation failed or was cancelled", error);
        }
    }

    return (
        <div id="modal-wrapper"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={handleWrapperClick}
            className="flex justify-center items-center fixed inset-0 z-50 bg-black bg-opacity-80 p-4">
            <div className="max-w-2xl w-full dark:bg-gray-800 bg-gray-100 p-3 md:p-6 shadow-md rounded-sm md:rounded-lg overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}>
                <div aria-labelledby="create saving modal-title" className="flex flex-row justify-between items-center mb-4">
                    <h2 id="create saving modal-title" className="text-black font-medium md:font-semibold dark:text-white text-lg md:text-xl">Create Saving</h2>
                    <button role="button" aria-label="close modal button" onClick={handleClose} className="font-medium text-black dark:text-white text-lg md:text-xl">
                        <FiX />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="flex flex-col justify-center space-y-2 flex-1">
                        <p className='dark:text-gray-300 text-gray-800 text-sm'>new image:</p>

                        <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex justify-center items-center border-2 border-dotted border-gray-400 h-40 min-w-full rounded-md overflow-hidden hover:border-blue-400 transition"
                        >
                            {newPreviewImageUrl ? (
                                <img
                                    src={newPreviewImageUrl}
                                    alt="Goal"
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-700 dark:text-gray-300 text-sm">Click to upload image</span>
                            )}
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        {newPreviewImageUrl && !imageUploaded && (
                            <p className="mt-2 text-sm text-white bg-green-600 rounded-sm text-center px-2 py-1">
                                Image is uploading...
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="purpose" className="text-black dark:text-white block mb-1">Purpose:</label>
                        <input type="text" id="purpose"
                            aria-invalid={!!errors.purpose} aria-describedby={errors.purpose ? "purpose-error" : undefined}
                            {...register('purpose')}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 
                                  ${errors.purpose ? 'border border-red-500 focus:ring-red-500'
                                    : 'focus:ring-blue-500'}`}
                            placeholder="Enter the Saving Purpose" />
                        {errors.purpose && (
                            <p id="purpose-error" className="text-red-400 text-sm">{errors.purpose.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="isNew" className="text-black dark:text-white mb-1 block md:inline md:mr-5">Is this a new saving goal?</label>
                        <input id="isNew"
                            type="checkbox"
                            {...register('isNew')}
                            className="mr-2 accent-blue-500"
                        />
                        <span className="text-black dark:text-white">Yes, it's new</span>
                    </div>
                    <div className="flex gap-5 md:flex-row flex-col">
                        <div className="flex-1">
                            <label htmlFor="amount" className="text-black dark:text-white block mb-1">Target Amount:</label>
                            <input type="number" id="amount"
                                aria-invalid={!!errors.amount} aria-describedby={errors.amount ? "amount-error" : undefined}
                                {...register('amount', { valueAsNumber: true })}
                                className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 
                                  ${errors.amount ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                placeholder="Enter the Target amount" />
                            {errors.amount && (
                                <p id="amount-error" className="text-red-400 text-sm">{errors.amount.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-5 md:flex-row flex-col">
                        <div className="flex-1">
                            <label htmlFor="expected_at" className="text-black dark:text-white block mb-1">Expected Date:</label>
                            <input type="date" id="expected_at" aria-invalid={!!errors.expected_at} aria-describedby={errors.expected_at ? "expected_at-error" : undefined}
                                {...register('expected_at')}
                                className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 
                                  ${errors.expected_at ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                placeholder="Enter the Target amount" />
                            {errors.expected_at && (
                                <p id="expected_at-error" className="text-red-400 text-sm">{errors.expected_at.message}
                                </p>
                            )}
                        </div>


                    </div>
                    <div className="flex-1">
                        <label htmlFor="source" className="text-black dark:text-white block mb-1">Source:</label>
                        <select {...register('source')} id="source"
                            aria-invalid={!!errors.source} aria-describedby={errors.source ? "source-error" : undefined}
                            className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 
                                  ${errors.source ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}>
                            <option value="">Select the Source of investment</option>
                            {payment_sources.map((src) => (
                                <option key={src} value={src}>{src}</option>
                            ))}
                        </select>
                        {errors.source && (
                            <p id="source-error" className="text-red-400 text-sm">{errors.source.message}</p>
                        )}
                    </div>
                    {
                        selectedSource === "Bank Account" &&
                        (<div className="flex md:flex-row flex-col gap-5">
                            <div className="flex-1">
                                <label htmlFor="source_detail" className="text-black dark:text-white block mb-1">Bank Account:</label>
                                <select {...register('source_detail')} id="source_detail"
                                    aria-invalid={!!errors.source_detail} aria-describedby={errors.source_detail ? "source_detail-error" : undefined}
                                    className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 
                                  ${errors.source_detail ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}>
                                    <option value="">Select the bank used</option>
                                    {bankAccounts.map((src) => (
                                        <option key={src} value={src}>{src}</option>
                                    ))}
                                </select>
                                {errors.source_detail && (
                                    <p id="source_detail-error" className="text-red-400 text-sm">{errors.source_detail.message}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="payment_app" className="text-black dark:text-white block mb-1">Payment App(Optional):</label>
                                <select {...register('payment_app')} id="payment_app"
                                    aria-invalid={!!errors.payment_app} aria-describedby={errors.payment_app ? "payment_app-error" : undefined}
                                    className={`bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 
                                  ${errors.payment_app ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}>
                                    <option value="">Select the Source of investment</option>
                                    {paymentApps.map((src) => (
                                        <option key={src} value={src}>{src}</option>
                                    ))}
                                </select>
                                {errors.payment_app && (
                                    <p id="payment_app-error" className="text-red-400 text-sm">{errors.payment_app.message}</p>
                                )}
                            </div>
                        </div>
                        )
                    }
                    <div className="pt-4 flex justify-end">
                        <button aria-label="Create saving" role="button"
                            type="submit"
                            className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg 
                                ${false ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {'Create Saving'}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default CreateSavingModal