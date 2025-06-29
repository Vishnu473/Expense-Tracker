import { toast } from "react-toastify";
import { profileSchema, type ProfileForm } from "../schemas/profileSchema";
import { useEffect, useMemo, useState } from "react";
import { useUpdateUser, useUser } from "../hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTheme } from "../context/ThemeContext";
import { lazy, Suspense } from 'react';
import { ThemeToggleRow } from "../components/Settings/ToggleThemeRow";
import clsx from "clsx";

const BankAccounts = lazy(() => import("../components/Settings/BankAccounts"));
const Categories = lazy(() => import("../components/Settings/Categories"));

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [initialProfile, setInitialProfile] = useState<ProfileForm | null>(null);


  const { data: userData } = useUser();
  const { mutate, isPending } = useUpdateUser();

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

  const isChanged = useMemo(() => {
    return (
      initialProfile &&
      (
        watchedValues.name !== initialProfile.name ||
        watchedValues.email !== initialProfile.email ||
        watchedValues.phone !== initialProfile.phone
      )
    );
  }, [watchedValues, initialProfile]);

  const onSubmit = (data: ProfileForm) => {
    mutate(data, {
      onSuccess: () => toast.success('Profile updated'),
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl w-full mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Settings</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-black dark:text-white block mb-1">Name:</label>
            <input 
              id="name" 
              aria-invalid={!!errors.name} 
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`border-gray-300 border dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 ${
                errors.name ? 'border border-red-500 focus:ring-red-500' : 'dark:focus:border-blue-600 focus:ring-blue-500'
              }`} 
              {...register('name')} 
              placeholder="Name" 
              autoComplete="name" 
            />
            {errors.name && <p id="name-error" className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="text-black dark:text-white block mb-1">Email:</label>
            <input 
              id="email" 
              aria-invalid={!!errors.email} 
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`border-gray-300 border dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 ${
                errors.email ? 'border border-red-500 focus:ring-red-500' : 'dark:focus:border-blue-600 focus:ring-blue-500'
              }`} 
              {...register('email')} 
              placeholder="Email" 
              autoComplete="email" 
            />
            {errors.email && <p id="email-error" className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="text-black dark:text-white block mb-1">Phone:</label>
            <input 
              id="phone" 
              aria-invalid={!!errors.phone} 
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`border-gray-300 border dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full focus:outline-none focus:ring-1 ${
                errors.phone ? 'border border-red-500 focus:ring-red-500' : ' dark:focus:border-blue-600 focus:ring-blue-500'
              }`} 
              {...register('phone')} 
              placeholder="Phone" 
              autoComplete="tel" 
            />
            {errors.phone && <p id="phone-error" className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          <button
            type="submit" 
            aria-busy={isPending}
            className={clsx(
              "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700", 
              isPending ? "disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50" : "bg-blue-600 dark:bg-cyan-600"
            )}
            disabled={!isChanged || isSubmitting || isPending}
          >
            {isPending ? "Saving...." : "Save Changes"}
          </button>
        </form>

        <Suspense fallback={<p aria-busy="true" className="text-gray-800 dark:text-white">Loading bank accounts...</p>}>
          <BankAccounts />
        </Suspense>

        <Suspense fallback={<p aria-busy="true" className="text-gray-800 dark:text-white">Loading categories...</p>}>
          <Categories />
        </Suspense>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">App Preferences</h2>
          <ThemeToggleRow theme={theme} ToggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  );
}

export default Settings;