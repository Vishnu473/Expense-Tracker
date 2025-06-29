import React, { useCallback, useState, useMemo } from "react";
import type { Category } from "../../interfaces/category";
import {
    useAddCategory,
    useDeleteCategory,
    useUpdateCategory
} from '../../hooks/useCategory';
import {
    addCategory as addToCategoryStore,
    updateCategory as renameInCategoryStore,
    deleteCategory as deleteFromCategoryStore,
} from '../../redux/slices/categorySlice';
import { FaRegEdit, FaTags, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "../../redux/store";
import { RenameCategoryModal } from "./RenameCategoryModal";
import { AddCategoryModal } from "./AddCategoryModal";

const Categories = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.category.categories);

    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);

    const addCategoryMutation = useAddCategory();
    const deleteCategoryMutation = useDeleteCategory();
    const renameCategoryMutation = useUpdateCategory();

    
    const handleAddCategory = useCallback((name: string, type: 'income' | 'expense' | 'saving') => {
        addCategoryMutation.mutate(
            { name, type },
            {
                onSuccess: (created: Category) => {
                    const alreadyExists = categories.some(cat => cat._id === created._id);
                    if (!alreadyExists) {
                        dispatch(addToCategoryStore(created));
                    }
                    toast.success('Category added');
                    setShowAddCategoryModal(false);
                },
                onError: () => {
                    toast.error('Failed to add category');
                }
            }
        );
    }, [addCategoryMutation, categories, dispatch]);

    
    const handleRenameCategory = useCallback((newName: string, newType: 'income' | 'expense' | 'saving') => {
        if (!selectedCategory) return;

        const updated = {
            _id: selectedCategory._id,
            name: newName,
            type: newType
        };

        dispatch(renameInCategoryStore(updated));

        renameCategoryMutation.mutate(
            { id: selectedCategory._id, payload: updated },
            {
                onSuccess: () => {
                    toast.success('Category renamed');
                    setShowRenameCategoryModal(false);
                },
                onError: () => {
                    dispatch(renameInCategoryStore(selectedCategory));
                    toast.error('Rename failed');
                }
            }
        );
    }, [selectedCategory, dispatch, renameCategoryMutation]);

    
    const handleDeleteCategory = useCallback((cat: Category) => {
        dispatch(deleteFromCategoryStore(cat._id));
        deleteCategoryMutation.mutate(cat._id, {
            onSuccess: () => toast.success('Category deleted'),
            onError: () => {
                dispatch(addToCategoryStore(cat));
                toast.error('Delete failed');
            },
        });
    }, [dispatch, deleteCategoryMutation]);

    
    const openRenameModal = useCallback((cat: Category) => {
        setSelectedCategory(cat);
        setShowRenameCategoryModal(true);
    }, []);

    
    const handleCloseAddModal = useCallback(() => {
        setShowAddCategoryModal(false);
    }, []);

    const handleOpenAddModal = useCallback(() => {
        setShowAddCategoryModal(true);
    }, []);

    const handleCloseRenameModal = useCallback(() => {
        setShowRenameCategoryModal(false);
    }, []);

    
    const categoriesList = useMemo(() => {
        if (categories.length === 0) {
            return (
                <p className="text-gray-500 dark:text-gray-300 italic">
                    No categories added yet.
                </p>
            );
        }

        return categories.map((cat: Category) => (
            <li 
                aria-label={`${cat.name} - ${cat.type}`}
                key={cat._id}
                className="flex justify-between items-center p-2 rounded hover:bg-gray-300 hover:dark:bg-gray-700"
            >
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex p-2 rounded-sm border border-gray-600 bg-gray-200 dark:bg-gray-700">
                        <FaTags className="dark:text-white text-black" />
                    </div>
                    <p className="font-medium text-gray-800 dark:text-white">{cat.name}</p>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                        -{cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                    </span>
                </div>

                <div className="space-x-2">
                    <button 
                        role="button"
                        onClick={() => openRenameModal(cat)}
                        className="dark:text-gray-300 text-gray-500 hover:underline"
                    >
                        <FaRegEdit className="text-lg" />
                    </button>
                    <button 
                        role="button" 
                        aria-label="delete category"
                        onClick={() => handleDeleteCategory(cat)}
                        className="dark:text-gray-300 text-gray-500 hover:underline"
                    >
                        <FaTrash className="text-lg" />
                    </button>
                </div>
            </li>
        ));
    }, [categories, openRenameModal, handleDeleteCategory]);

    return (
        <div className="mt-8" aria-busy={addCategoryMutation.isPending || renameCategoryMutation.isPending}>
            <h2 aria-label="Categories title" className="text-xl font-semibold mb-2 dark:text-white">
                Categories
            </h2>
            <ul className="space-y-2">
                {categoriesList}
            </ul>

            <button
                className="mt-4 px-4 py-2 border rounded text-sm dark:text-white"
                onClick={handleOpenAddModal}
            >
                + Add Category
            </button>

            <AddCategoryModal
                isOpen={showAddCategoryModal}
                onClose={handleCloseAddModal}
                handleAddCategory={handleAddCategory}
                isLoading={addCategoryMutation.isPending}
            />

            {selectedCategory && (
                <RenameCategoryModal
                    key={selectedCategory._id}
                    isOpen={showRenameCategoryModal}
                    onClose={handleCloseRenameModal}
                    initialCategory={selectedCategory}
                    onRename={handleRenameCategory}
                    isLoading={renameCategoryMutation.isPending}
                />
            )}
        </div>
    );
};

export default React.memo(Categories);