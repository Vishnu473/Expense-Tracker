import type { Saving } from "../../interfaces/saving";
import axiosInstance from "../axiosInstance";

export const uploadImage = async (formData: FormData): Promise<string> => {
    const response = await axiosInstance.post('/saving/single/image', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.status === 200) {
        return response.data?.url ?? '';
    }
    throw new Error('Image upload failed');
};

export const createSaving = async (saving: Saving, signal?: AbortSignal) => {
    const response = await axiosInstance.post('/saving/create', saving, { signal });
    return response.data;
}
