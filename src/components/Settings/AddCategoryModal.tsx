import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiX } from 'react-icons/fi';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddCategory: (name: string, type: 'income' | 'expense' | 'saving') => void;
  isLoading: boolean;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = React.memo(({
  isOpen,
  onClose,
  handleAddCategory,
  isLoading
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'saving'>('income');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setType('income');
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as 'income' | 'expense' | 'saving');
  }, []);

  const handleSubmit = useCallback(() => {
    if (name.trim()) {
      handleAddCategory(name.trim(), type);
      setName('');
      setType('income');
    }
  }, [name, type, handleAddCategory]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      onClick={handleBackdropClick} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-category-title"
        onClick={handleModalClick}
        className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg relative"
      >
        <h2 id="add-category-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add New Category
        </h2>
        
        <input
          type="text"
          value={name}
          ref={inputRef}
          aria-label="add category name"
          onChange={handleNameChange}
          className="w-full px-4 py-2 border rounded outline-none border-blue-600 dark:bg-gray-800 dark:text-white mb-3"
          placeholder="Category Name"
        />
        
        <select
          value={type}
          aria-label="category type"
          onChange={handleTypeChange}
          className="w-full px-4 py-2 border rounded outline-none border-blue-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="saving">Saving</option>
        </select>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            aria-label="cancel modal"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            aria-label={`Add ${name}`}
            aria-busy={isLoading}
            disabled={!name.trim() || isLoading}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
        
        <button
          aria-label="close button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
});