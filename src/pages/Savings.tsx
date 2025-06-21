import { lazy, Suspense, useCallback } from 'react';

const CreateSavingModal = lazy(() => import('../components/Saving/CreateSavingModal'));
const SavingModal = lazy(() => import('../components/Saving/SavingModal'));

import { useState } from 'react';
import { format } from 'date-fns';
import { useGetSavings } from '../hooks/useSavings';
import type { Saving } from '../interfaces/saving';
import ProgressBar from '../components/Saving/ProgressBar';

const Savings = () => {
  const { data: savings, isLoading, error } = useGetSavings();

  const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
  const [selectedSaving, setSelectedSaving] = useState<Saving | null>(null);
  
  //Prevent unnecessary re-creations of the modal control functions that may cause re-renders.
  const openCreateModal = useCallback(() => setIsCreateModal(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModal(false), []);
  const openEditModal = useCallback((saving: Saving) => setSelectedSaving(saving), []);
  const closeEditModal = useCallback(() => setSelectedSaving(null), []);

  if (error) return <div className="text-red-400">{error.message}</div>
  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className='flex flex-row justify-between items-center my-6 '>
        <h2 className="text-2xl font-bold dark:text-white">Savings Goals</h2>
        <button
          className="inline-flex items-center gap-2 px-3 py-1.5 border dark:border-gray-400 rounded-md text-sm dark:text-white bg-zinc-100 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-zinc-200"
          onClick={openCreateModal}
        >Add Goal
        </button>
      </div>

      <div className="grid gap-6">
        {savings?.map((saving: Saving) => {
          const percentage = Math.min(
            100, (saving.current_amount / saving.amount) * 100).toFixed(2);
          return (
            <div key={saving._id}
              className="bg-white dark:bg-gray-700 shadow-md rounded-lg flex flex-col gap-5 p-4">
              <div>
                <div
                  className="flex flex-col md:flex-row gap-4"
                >

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                      {saving.purpose}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-gray-400 mb-2">
                      Save ₹{saving.amount.toLocaleString()} by{' '}
                      {format(new Date(saving.expected_at), 'PPP')}
                    </p>
                    <button
                      className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 border dark:border-1 rounded-md text-sm dark:text-white bg-zinc-100 dark:bg-gray-500 dark:border-gray-400 dark:hover:bg-gray-600 hover:bg-zinc-200"
                      onClick={() => openEditModal(saving)}
                    >Edit Goal
                    </button>
                  </div>
                  <div className='flex-1'>
                    <img
                      src={saving?.pic}
                      loading="lazy"
                      alt="goal-pic"
                      className="w-full h-28 object-cover rounded-lg"
                    />
                  </div>
                </div>
                <div className='px-1'>
                  <h3 className='font-semibold text-black dark:text-white mb-2'>Progress</h3>
                  <div className="w-full h-1.5 bg-zinc-200 dark:bg-gray-400 rounded-full overflow-hidden mb-1">
                    <ProgressBar targetPercent={parseFloat(percentage)} />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-gray-400 mt-2">
                    ₹{saving.current_amount.toLocaleString()} of ₹
                    {saving.amount.toLocaleString()} ({percentage}%)
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {selectedSaving && (
        <Suspense fallback={<div>Loading Edit Modal...</div>}>
          <SavingModal saving={selectedSaving} onClose={closeEditModal} />
        </Suspense>
      )}

      {isCreateModal && (
        <Suspense fallback={<div>Loading Create Modal...</div>}>
          <CreateSavingModal isCreateModal={isCreateModal} closeModal={closeCreateModal} />
        </Suspense>
      )}
    </div>
  );
};

export default Savings;
