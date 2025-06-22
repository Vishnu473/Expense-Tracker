import { toast } from "react-toastify";
import { profileSchema, type ProfileForm } from "../schemas/profileSchema";
import { useEffect, useState } from "react";
import { useAddBankAccount, useDeleteBankAccount, useRenameBankAccount } from "../hooks/useBankAccounts";
import { useUpdateUser, useUser } from "../hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FiBell } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { FaRegEdit, FaTrash, FaUniversity } from 'react-icons/fa'
import { ThemeToggleRow } from "../components/Settings/ToggleThemeRow";
import { RenameBankModal } from "../components/Settings/RenameBankModal";
import { useDispatch, useSelector } from "react-redux";
import { addBankAccount as addToStore } from "../redux/slices/bankSlice";
import { renameBankAccount as renameInStore } from "../redux/slices/bankSlice";
import { deleteBankAccount as deleteFromStore } from "../redux/slices/bankSlice";
import type { RootState } from "../redux/store";
import Categories from "../components/Settings/Categories";

const Settings = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const { theme, toggleTheme } = useTheme();
  const [initialProfile, setInitialProfile] = useState<ProfileForm | null>(null);
  const dispatch = useDispatch();

  const { data: userData } = useUser();
  const updateUserMutation = useUpdateUser();
  const deleteMutation = useDeleteBankAccount();
  const renameMutation = useRenameBankAccount();
  const addMutation = useAddBankAccount();

  const bankAccounts = useSelector((state: RootState) => state.bank.bankAccounts);
  console.log(bankAccounts);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.user?.name ?? '',
      email: userData?.user?.email ?? '',
      phone: userData?.user?.phone ?? ''
    }
  });

  useEffect(() => {
    if (userData?.user) {
      const profile = {
        name: userData.user.name ?? '',
        email: userData.user.email ?? '',
        phone: userData.user.phone ?? '',
      };
      reset(profile);
      setInitialProfile(profile);
    }
  }, [userData, reset]);

  const watchedValues = watch();

  const isChanged =
    initialProfile &&
    (
      watchedValues.name !== initialProfile.name ||
      watchedValues.email !== initialProfile.email ||
      watchedValues.phone !== initialProfile.phone
    );


  const onSubmit = (data: ProfileForm) => {
    console.log(data);

    updateUserMutation.mutate(data, {
      onSuccess: () => toast.success('Profile updated'),
    });
  };

  const handleAddAccount = () => {
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
  };

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedBankName, setSelectedBankName] = useState('');

  const openRenameModal = (name: string) => {
    setSelectedBankName(name);
    setShowRenameModal(true);
  };

  const handleRename = (newName: string) => {
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
  };


  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl w-full mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Settings</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-black dark:text-white block mb-1">Name:</label>
            <input className={`border-gray-300 border dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 ${errors.name ? 'border border-red-500 focus:ring-red-500' : 'dark:focus:border-blue-600 focus:ring-blue-500'
              }`} {...register('name')} placeholder="Name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-black dark:text-white block mb-1">Email:</label>
            <input className={`border-gray-300 border dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 ${errors.email ? 'border border-red-500 focus:ring-red-500' : 'dark:focus:border-blue-600 focus:ring-blue-500'
              }`} {...register('email')} placeholder="Email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-black dark:text-white block mb-1">Phone:</label>
            <input className={`border-gray-300 border dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 ${errors.phone ? 'border border-red-500 focus:ring-red-500' : ' dark:focus:border-blue-600 focus:ring-blue-500'
              }`} {...register('phone')} placeholder="Phone" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!isChanged || isSubmitting}
          >
            Save Changes
          </button>

        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Linked Accounts</h2>
          <ul className="space-y-2">
            {bankAccounts?.map((name: string) => (
              <li
                key={name}
                className="flex justify-between items-center p-2 rounded hover:bg-gray-300 hover:dark:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm border border-gray-600 bg-gray-200 dark:bg-gray-700">
                    <FaUniversity className="dark:text-white text-black" />
                  </div>
                  <p className="font-medium text-gray-800 dark:text-white">{name}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => openRenameModal(name)}
                    className="dark:text-gray-300 text-gray-500 hover:underline"
                  >
                    <FaRegEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => {
                      dispatch(deleteFromStore(name));
                      deleteMutation.mutate(name, {
                        onSuccess: () => {
                          toast.success('Account deleted');
                        },
                        onError: () => {
                          dispatch(addToStore(name));
                          toast.error('Delete failed.');
                        },
                      });
                    }}
                    className="dark:text-gray-300 text-gray-500 hover:underline"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="mt-4 px-4 py-2 border rounded text-sm dark:text-white"
            onClick={() => setShowAddModal(true)}
          >
            + Add Account
          </button>

          {showAddModal && (
            <div className="mt-2 flex gap-2 items-center">
              <input
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="p-2 border rounded focus:border-blue-600 w-full outline-none dark:bg-gray-700 dark:text-white"
                placeholder="Account Name"
              />
              <button
                onClick={handleAddAccount}
                disabled={addMutation.isPending}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <RenameBankModal
          isOpen={showRenameModal}
          onClose={() => setShowRenameModal(false)}
          initialName={selectedBankName}
          onRename={handleRename}
          isLoading={renameMutation.isPending}
        />

        <Categories />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">App Preferences</h2>
          <div className="flex justify-between items-center p-2 rounded">
            <div className="flex items-center gap-3">
              <div className="bg-gray-300 dark:bg-gray-700 border border-gray-600 p-1 rounded-sm">
                <FiBell className="text-xl text-black dark:text-white" />
              </div>
              <p className="text-black dark:text-white">Notifications</p>
            </div>

            <input type="checkbox" />
          </div>
          <ThemeToggleRow theme={theme} ToggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  );
}


export default Settings;
