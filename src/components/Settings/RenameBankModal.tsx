import React, { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

interface RenameBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  onRename: (newName: string) => void;
  isLoading: boolean;
}

const RenameBankModal: React.FC<RenameBankModalProps> = ({
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
    setName(initialName);
    setTimeout(() => inputRef.current?.focus(), 100);
  }
}, [isOpen, initialName]);

  if (!isOpen){
    return null;
  };

  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="rename-bank-title"
     className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg relative animate-fadeIn">
        
        <h2 id="rename-bank-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Rename Bank Account
        </h2>

        <input
          type="text" aria-label='rename bank account' id='renameBankAccount'
          value={name}
          ref={inputRef}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded outline-none border-blue-600 dark:bg-gray-800 dark:text-white"
          placeholder="Rename Bank Account Name"
        />

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button aria-busy={isLoading}
            onClick={() => name && name !== initialName && onRename(name)}
            disabled={isLoading || !name || name === initialName}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-none"
          >
            {isLoading ? 'Renaming...' : 'Save'}
          </button>
        </div>

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

export default RenameBankModal;