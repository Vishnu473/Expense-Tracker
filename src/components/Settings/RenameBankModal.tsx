import React, { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

interface RenameBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  onRename: (newName: string) => void;
  isLoading: boolean;
}

export const RenameBankModal: React.FC<RenameBankModalProps> = ({
  isOpen,
  onClose,
  initialName,
  onRename,
  isLoading,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  if (isOpen) {
    setTimeout(() => inputRef.current?.focus(), 100); // using a ref on input
  }
}, [isOpen]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg relative animate-fadeIn">
        {/* Modal header */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Rename Bank Account
        </h2>

        {/* Input */}
        <input
          type="text"
          value={name}
          ref={inputRef}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded outline-none border-blue-600 dark:bg-gray-800 dark:text-white"
          placeholder="New Bank Account Name"
        />

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => name && name !== initialName && onRename(name)}
            disabled={isLoading || !name || name === initialName}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Renaming...' : 'Save'}
          </button>
        </div>

        {/* Close button (top-right) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <FiX/>
        </button>
      </div>
    </div>
  );
};
