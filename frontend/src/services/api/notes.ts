import { client } from './client';
import { Note } from '@/types';

/**
 * Parameters for filtering notes
 */
export interface NotesFilter {
    category?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}

/**
 * List notes with optional filters
 *
 * @param filters - Optional filters for category, search, and date range
 * @returns Array of filtered notes
 */
export const getNotes = async (filters?: NotesFilter): Promise<Note[]> => {
    const params: Record<string, string> = {};

    if (filters?.category && filters.category !== 'All Categories') {
        params.category = filters.category;
    }
    if (filters?.search) {
        params.search = filters.search;
    }
    if (filters?.dateFrom) {
        params.date_from = filters.dateFrom;
    }
    if (filters?.dateTo) {
        params.date_to = filters.dateTo;
    }

    const response = await client.get<Note[]>('/notes/', { params });
    return response.data;
};

/**
 * Create a new note
 */
export interface CreateNoteData {
    title: string;
    body: string;
    category_id: number;
}

export const createNote = async (data: CreateNoteData): Promise<Note> => {
    const response = await client.post<Note>('/notes/', data);
    return response.data;
};

/**
 * Update an existing note
 */
export type UpdateNoteData = Partial<CreateNoteData>;

export const updateNote = async (id: number, data: UpdateNoteData): Promise<Note> => {
    const response = await client.patch<Note>(`/notes/${id}/`, data);
    return response.data;
};

/**
 * Delete a note
 */
export const deleteNote = async (id: number): Promise<void> => {
    await client.delete(`/notes/${id}/`);
};
