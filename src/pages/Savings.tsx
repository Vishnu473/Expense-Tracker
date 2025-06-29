import { lazy, Suspense, useCallback } from 'react';

const CreateSavingModal = lazy(() => import('../components/Saving/CreateSavingModal'));
const SavingModal = lazy(() => import('../components/Saving/SavingModal'));

import { useState } from 'react';
import { format } from 'date-fns';
import { useGetSavings } from '../hooks/useSavings';
import type { Saving } from '../interfaces/saving';
import ProgressBar from '../components/Saving/ProgressBar';
import SavingCardSkeleton from '../components/Skeletons/Savings/SavingCardSkeleton';

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
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SavingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }


  return (
    <>
      {
        savings.length === 0 ? (
          <div className="p-8 w-full h-screen flex flex-col justify-center items-center text-center">
            <p
              className="text-gray-600 dark:text-gray-300 text-lg mb-4"
              role="status"
              aria-live="polite"
            >
              No Savings/Goals.
            </p>
            <button role='button' type='button' aria-label='add goal'
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
              onClick={openCreateModal}
            >Add Goal
            </button>
          </div>
        ) : (
          <div className="p-6 bg-gray-100 dark:bg-gray-800">
            <div className='max-w-4xl mx-auto'>
              <div aria-labelledby='savings goal title' className='flex flex-row justify-between items-center mb-4'>
                <h2 id='savings goal title' className="text-3xl font-bold dark:text-white ">Savings Goals</h2>
                <button role='button' type='button' aria-label='add goal'
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
                      className="cursor-pointer bg-white border-white hover:shadow-lg dark:border-gray-800 border hover:dark:border-gray-500 hover:border-gray-300 dark:bg-gray-700 shadow-md rounded-lg flex flex-col gap-5 p-4">
                      <div>
                        <div role='saving-card'
                          className="flex flex-col md:flex-row gap-4"
                        >

                          <div className="flex-1">
                            <h3 aria-label={`${saving.purpose}`} className="text-lg font-semibold text-zinc-800 dark:text-white">
                              {saving.purpose}
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-gray-400 mb-2">
                              Save ₹{saving.amount.toLocaleString()} by{' '}
                              {format(new Date(saving.expected_at), 'PPP')}
                            </p>
                            <button aria-label='Edit Goal' type='button'
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
                          <p aria-label={`${percentage}%`} className="text-xs text-zinc-500 dark:text-gray-400 mt-2">
                            ₹{saving.current_amount.toLocaleString()} of ₹
                            {saving.amount.toLocaleString()} ({percentage}%)
                          </p>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      }

      {
        selectedSaving && (
          <Suspense fallback={<div>Loading Edit Modal...</div>}>
            <SavingModal saving={selectedSaving} onClose={closeEditModal} />
          </Suspense>
        )
      }

      <Suspense fallback={<div>Loading Create Modal...</div>}>
        <CreateSavingModal isCreateModal={isCreateModal} closeModal={closeCreateModal} />
      </Suspense>
    </>

  );
};

export default Savings;
