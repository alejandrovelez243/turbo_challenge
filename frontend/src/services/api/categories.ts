import { client } from './client';
import { Category } from '@/types';

/**
 * List all categories for the authenticated user
 */
export const getCategories = async (): Promise<Category[]> => {
    const response = await client.get<Category[]>('/categories/');
    return response.data;
};

/**
 * Create a new category
 */
export const createCategory = async (data: { name: string; color: string }): Promise<Category> => {
    const response = await client.post<Category>('/categories/', data);
    return response.data;
};
