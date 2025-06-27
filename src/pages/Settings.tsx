import { toast } from "react-toastify";
import { profileSchema, type ProfileForm } from "../schemas/profileSchema";
import { useEffect, useState } from "react";
import { useUpdateUser, useUser } from "../hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FiBell } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { lazy, Suspense } from 'react';
import { ThemeToggleRow } from "../components/Settings/ToggleThemeRow";
const BankAccounts= lazy(() => import("../components/Settings/BankAccounts"));
const Categories = lazy(() => import("../components/Settings/Categories"));

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [initialProfile, setInitialProfile] = useState<ProfileForm | null>(null);

  const { data: userData } = useUser();
  const updateUserMutation = useUpdateUser();

  
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
        
        <Suspense fallback={<p className="text-gray-800 dark:text-white">Loading categories...</p>}>
          <BankAccounts />
        </Suspense>

        <Suspense fallback={<p className="text-gray-800 dark:text-white">Loading categories...</p>}>
          <Categories />
        </Suspense>


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
