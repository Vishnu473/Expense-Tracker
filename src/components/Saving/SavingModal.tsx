import { useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { Saving } from '../../interfaces/saving';
import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

interface SavingModalProps {
  saving: Saving;
  onClose: () => void;
}

const SavingModal = ({ saving, onClose }: SavingModalProps) => {
  const [imageUploaded, setImageUploaded] = useState<Boolean>(false);
  const [newPreviewImageUrl, setNewPreviewImageUrl] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors }, } = useForm({
    defaultValues: {
      purpose: saving.purpose,
      addAmount: 0,
      transaction_date: ''
    },
  });

  const { mutate: updateGoal, isPending } = useMutation({
    mutationFn: async (data: { purpose: string; pic: string, addAmount: number, transaction_date: string }) => {
      const updated = { ...saving, purpose: data.purpose, pic: data.pic, current_amount: saving.current_amount + data.addAmount, transaction_date: data.transaction_date };
      const res = await axiosInstance.put(`/saving/${saving._id}`, updated);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      toast.success('Goal updated successfully');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update goal');
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setNewPreviewImageUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("file", file); // Use 'image' as expected by backend

      console.log([...formData]);

      await callImageUploadApi(formData);
    }
  };

  const callImageUploadApi = async (formData: FormData) => {
    try {
      const response = await axiosInstance.post('/saving/single/image', formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response?.data);

      if (response.status === 200) {
        console.log("Image uploaded successfully to Cloud.....");
        setNewImageUrl(response?.data?.url ?? 'https://dummyimage.com/600x400/000/fff&text=Uploaded+Image');
        setImageUploaded(true);
        return newImageUrl;
      }
    } catch (error) {
      setImageUploaded(false);
      console.log("Failed to update the image");
      return saving?.pic;
    }
  };

  const onSubmit = async (data: { purpose: string; addAmount: number; transaction_date: string }) => {
    const imageUrl = imageUploaded ? newImageUrl : saving.pic ?? '';
    updateGoal({ purpose: data.purpose, pic: imageUrl, addAmount: Number(data.addAmount), transaction_date: data.transaction_date });
    handleModalClose();
  };

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
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-80 z-50 p-4"
      onClick={handleWrapperClick}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl overflow-auto">
        <div aria-labelledby="update saving modal-title" className="flex justify-between items-center mb-4">
          <h2 id="update saving modal-title" className="text-white text-xl">Edit Goal</h2>
          <button role="button" aria-label="close modal button" onClick={onClose} className="text-black dark:text-white text-2xl">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className='flex flex-row gap-3'>
            <div className='flex flex-col space-y-2 flex-1'>
              <p className='dark:text-gray-300 text-gray-800 text-sm'>old image:</p>
              <img className='h-40 rounded object-cover'
                loading="lazy"
                src={saving?.pic ?? 'https://www.rd.com/wp-content/uploads/2020/04/hanauma-bay-on-the-island-of-o-ahu-in-the-united-states-of-america-e1643060191903.jpg'} alt={saving?.purpose} />
            </div>
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
                  <span className="text-gray-300 text-sm">Click to upload image</span>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

            </div>
          </div>
          <div>
            <label htmlFor='purpose' className="block text-white mb-1">Purpose:</label>
            <input id='purpose' aria-invalid={!!errors.purpose} aria-describedby={errors.purpose ? "purpose-error" : undefined}
              type="text"
              {...register('purpose')}
              className="bg-gray-700 text-white p-2 rounded w-full"
              placeholder="Enter new purpose"
            />
            {errors.purpose && (
              <p id='purpose-error' className="text-red-400 text-sm">{errors.purpose.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor='addAmount' className="block text-white mb-1">Enter amount:</label>
            <input id='addAmount'
              type="number" aria-invalid={!!errors.addAmount} aria-describedby={errors.addAmount ? "addAmount-error" : undefined}
              {...register('addAmount', { valueAsNumber: true })}
              className="bg-gray-700 text-white p-2 rounded w-full"
              placeholder="Enter amount"
            />
            {errors.addAmount && (
              <p id='addAmount-error' className="text-red-400 text-sm">{errors.addAmount.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor='transaction_date' className="block text-white mb-1">Transaction Date:</label>
            <input id='transaction_date'
              type="date" aria-invalid={!!errors.transaction_date} aria-describedby={errors.transaction_date ? "transaction_date-error" : undefined}
              {...register('transaction_date')}
              className="bg-gray-700 text-white p-2 rounded w-full"
              placeholder="Enter transaction date"
            />
            {errors.transaction_date && (
              <p id='transaction_date-error' className="text-red-400 text-sm">{errors.transaction_date.message}
              </p>
            )}
          </div>
          <input
            type="submit" role='button' aria-label={isPending ? 'Updating...' : 'Update Goal'} aria-busy={isPending}
            value={isPending ? 'Updating...' : 'Update Goal'}
            disabled={Boolean(isPending || (newPreviewImageUrl && !imageUploaded))}
            className={`px-4 py-2 rounded cursor-pointer transition w-full
                ${isPending || (newPreviewImageUrl && !imageUploaded)
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          />

          {newPreviewImageUrl && !imageUploaded && (
            <p className="mt-2 text-sm text-white bg-green-600 rounded-sm text-center px-2 py-1">
              Image is uploading...
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SavingModal;
