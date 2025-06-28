import React, { useEffect, useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddCategory: (name: string, type: 'income' | 'expense' | 'saving') => void;
  isLoading: boolean;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  handleAddCategory,
  isLoading
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'saving'>('income');

  if (!isOpen) return null;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div role='dialog' aria-modal="true" aria-labelledby="add-category-title" onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 aria-labelledby='Add Category title' className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Category</h2>
        <input
          type="text"
          value={name}
          ref={inputRef}
          aria-label="add category name"
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded outline-none border-blue-600 dark:bg-gray-800 dark:text-white mb-3"
          placeholder="Category Name"
        />
        <select
          value={type}
          aria-label="category type"
          onChange={(e) => setType(e.target.value as any)}
          className="w-full px-4 py-2 border rounded outline-none border-blue-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="saving">Saving</option>
        </select>
        <div className="mt-6 flex justify-end space-x-3">
          <button aria-label='cancel modal' onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Cancel</button>
          <button aria-label={`Add ${name}`} aria-busy={isLoading}
            disabled={!name || isLoading}
            onClick={() => handleAddCategory(name, type)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
        <button aria-label='close button' onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
          <FiX />
        </button>
      </div>
    </div>
  );
};