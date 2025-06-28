import { FaRegEdit, FaTrash, FaUniversity } from "react-icons/fa";
import React, { lazy, Suspense, useCallback, useState } from "react";
import { addBankAccount as addToStore } from "../../redux/slices/bankSlice";
import { renameBankAccount as renameInStore } from "../../redux/slices/bankSlice";
import { deleteBankAccount as deleteFromStore } from "../../redux/slices/bankSlice";
import { useAddBankAccount, useDeleteBankAccount, useRenameBankAccount } from "../../hooks/useBankAccounts";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { toast } from "react-toastify";
const RenameBankModal = lazy(() => import("../Settings/RenameBankModal"));


const BankAccounts = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const bankAccounts = useSelector((state: RootState) => state.bank.bankAccounts);

    const dispatch = useDispatch();
    const deleteMutation = useDeleteBankAccount();
    const renameMutation = useRenameBankAccount();
    const addMutation = useAddBankAccount();

    const handleAddAccount = useCallback(() => {
        if (newAccountName.trim()) {
            dispatch(addToStore(newAccountName));

            addMutation.mutate(newAccountName, {
                onSuccess: () => {
                    toast.success('Account added');
                    setNewAccountName('');
                    setShowAddModal(false);
                },
                onError: () => {
                    dispatch(deleteFromStore(newAccountName));
                    toast.error('Failed to add account. Reverted.');
                }
            });
        }
    },[dispatch,addMutation, newAccountName]);

    const [showRenameModal, setShowRenameModal] = useState(false);
    const [selectedBankName, setSelectedBankName] = useState('');

    const openRenameModal = useCallback((name: string) => {
        setSelectedBankName(name);
        setShowRenameModal(true);
    },[]);

    const handleRename = useCallback((newName: string) => {
        dispatch(renameInStore({ oldName: selectedBankName, newName }));

        renameMutation.mutate({ oldName: selectedBankName, newName }, {
            onSuccess: () => {
                toast.success('Bank account renamed');
                setShowRenameModal(false);
            },
            onError: () => {
                dispatch(renameInStore({ oldName: newName, newName: selectedBankName }));
                toast.error('Rename failed.');
            }
        });
    },[dispatch,renameMutation,selectedBankName]);

    const handleDeleteAccount = useCallback((nameToDelete: string) => {
        dispatch(deleteFromStore(nameToDelete));
        deleteMutation.mutate(nameToDelete, {
            onSuccess: () => {
                toast.success('Account deleted');
            },
            onError: () => {
                dispatch(addToStore(nameToDelete));
                toast.error('Delete failed.');
            },
        });
    },[dispatch, deleteMutation])

    return (
        <>
            <div className="mt-8" role="region" aria-labelledby="linked-accounts-title">
                <h2 id="linked-accounts-title" className="text-xl font-semibold mb-2 dark:text-white">Linked Accounts</h2>
                {bankAccounts?.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-300 italic">No linked accounts.</p>
                ) : (<ul className="space-y-2">
                    {bankAccounts?.map((name: string) => (
                        <li aria-label={`${name}-bank`}
                            key={name}
                            className="flex justify-between items-center p-2 rounded hover:bg-gray-300 hover:dark:bg-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-sm border border-gray-600 bg-gray-200 dark:bg-gray-700">
                                    <FaUniversity className="dark:text-white text-black" />
                                </div>
                                <p aria-label="bank account name" className="font-medium text-gray-800 dark:text-white">{name}</p>
                            </div>
                            <div className="space-x-2">
                                <button type="button" aria-label={`Rename ${name}`}
                                    onClick={() => openRenameModal(name)}
                                    className="dark:text-gray-300 text-gray-500 hover:underline"
                                >
                                    <FaRegEdit className="text-lg" />
                                </button>
                                <button type="button" aria-label={`Delete ${name}`}
                                    onClick={() => handleDeleteAccount(name)}
                                    className="dark:text-gray-300 text-gray-500 hover:underline"
                                >
                                    <FaTrash className="text-lg" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>)}

                <button role="button" type="button" aria-label="add account"
                    className="mt-4 px-4 py-2 border rounded text-sm dark:text-white"
                    onClick={() => setShowAddModal(true)}
                >
                    + Add Account
                </button>

                {showAddModal && (
                    <div aria-label="add account form" className="mt-2 flex gap-2 items-center">
                        <input id="newAccountName" aria-label="new account name"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                            className="p-2 border rounded focus:border-blue-600 w-full outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="Account Name"
                        />
                        <button type="button" aria-busy={addMutation.isPending} role="button"
                            onClick={handleAddAccount} aria-label="add account button"
                            disabled={addMutation.isPending}
                            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-none"
                        >
                            Add
                        </button>
                        <button type="button" role="button" aria-label="cancel add account"
                            onClick={() => setShowAddModal(false)}
                            className="text-gray-600 dark:text-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            <Suspense fallback={null}>
                {showRenameModal && (
                    <RenameBankModal
                        isOpen={true}
                        onClose={() => setShowRenameModal(false)}
                        initialName={selectedBankName}
                        onRename={handleRename}
                        isLoading={renameMutation.isPending}
                    />
                )}
            </Suspense>

        </>
    )
}

export default React.memo(BankAccounts);