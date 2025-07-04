import React, { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import type { Category } from '../../interfaces/category';

interface RenameCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory: Category;
  onRename: (newName: string, newType: Category['type']) => void;
  isLoading: boolean;
}

export const RenameCategoryModal: React.FC<RenameCategoryModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onRename,
  isLoading
}) => {
  const [name, setName] = useState(initialCategory.name);
  const [type, setType] = useState<Category['type']>(initialCategory.type);

  useEffect(() => {
    setName(initialCategory.name);
    setType(initialCategory.type);
  }, [initialCategory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);


  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div role='dialog' aria-modal="true" aria-labelledby="rename-category-title" onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 aria-labelledby='Rename Category title' className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rename Category</h2>
        <input
          type="text"
          value={name}
          ref={inputRef}
          aria-label="new category name"
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded outline-none border-blue-600 dark:bg-gray-800 dark:text-white mb-3"
          placeholder="New Category Name"
        />
        <select
          value={type}
          aria-label='category type'
          onChange={(e) => setType(e.target.value as any)}
          className="w-full px-4 py-2 border rounded outline-none border-blue-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="saving">Saving</option>
        </select>
        <div className="mt-6 flex justify-end space-x-3">
          <button aria-label='cancel modal' onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Cancel</button>
          <button aria-label={`Rename ${name}`} aria-busy={isLoading}
            disabled={!name || !type || isLoading || name === initialCategory.name || type === initialCategory.type}
            onClick={() => name && name !== initialCategory.name && onRename(name, type)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Renaming...' : 'Save'}
          </button>
        </div>
        <button aria-label='close button' onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
          <FiX />
        </button>
      </div>
    </div>
  );
};