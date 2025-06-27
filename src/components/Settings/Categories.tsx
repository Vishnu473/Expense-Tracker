import React, { useState } from "react";
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

    const addCategoryMutation = useAddCategory();
    const deleteCategoryMutation = useDeleteCategory();
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);

    console.log("Categories loaded");
    console.log("Redux categories:", categories);

    const handleAddCategory = (name: string, type: 'income' | 'expense' | 'saving') => {
        const newCat = { name: name, type: type };

        console.log(newCat);

        dispatch(addToCategoryStore({ _id: 'temp-id', name, type })); // optimistic

        addCategoryMutation.mutate(newCat, {
            onSuccess: (response) => {
                const created = response.data as Category;
                dispatch(deleteFromCategoryStore('temp-id'));
                dispatch(addToCategoryStore(created));
                toast.success('Category added');
                setShowAddCategoryModal(false);
            },
            onError: () => {
                dispatch(deleteFromCategoryStore('temp-id'));
                toast.error('Failed to add category');
            }
        });
    };

    const renameCategoryMutation = useUpdateCategory();

    const handleRenameCategory = (newName: string, newType: 'income' | 'expense' | 'saving') => {
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
    };

    const handleDeleteCategory = (cat: Category) => {
        dispatch(deleteFromCategoryStore(cat._id));
        deleteCategoryMutation.mutate(cat._id, {
            onSuccess: () => toast.success('Category deleted'),
            onError: () => {
                dispatch(addToCategoryStore(cat));
                toast.error('Delete failed');
            },
        });
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Categories</h2>
            <ul className="space-y-2">
                {categories?.map((cat) => (
                    <li
                        key={cat._id}
                        className="flex justify-between items-center p-2 rounded hover:bg-gray-300 hover:dark:bg-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex p-2 rounded-sm border border-gray-600 bg-gray-200 dark:bg-gray-700">
                                <FaTags className="dark:text-white text-black" />
                            </div>
                            <p className="font-medium text-gray-800 dark:text-white">{cat.name}</p>
                            <span className="text-sm text-gray-500 dark:text-gray-300">
                                -{cat.type}
                            </span>
                        </div>

                        <div className="space-x-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setShowRenameCategoryModal(true);
                                }}
                                className="dark:text-gray-300 text-gray-500 hover:underline"
                            >
                                <FaRegEdit className="text-lg" />
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(cat)}
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
                onClick={() => setShowAddCategoryModal(true)}
            >
                + Add Category
            </button>

            {showAddCategoryModal && (
                <AddCategoryModal
                    isOpen={showAddCategoryModal}
                    onClose={() => setShowAddCategoryModal(false)}
                    handleAddCategory={handleAddCategory}
                    isLoading={addCategoryMutation.isPending}
                />
            )}

            {selectedCategory && (
                <RenameCategoryModal
                    isOpen={showRenameCategoryModal}
                    onClose={() => setShowRenameCategoryModal(false)}
                    initialCategory={selectedCategory}
                    onRename={handleRenameCategory}
                    isLoading={renameCategoryMutation.isPending}
                />
            )}
        </div>
    )
};

export default React.memo(Categories);