/**
 * User interface based on OpenAPI schema
 */
export interface User {
    id: number;
    username: string;
    email: string;
}

/**
 * Category interface based on OpenAPI schema
 */
export interface Category {
    id: number;
    name: string;
    color: string;
    note_count: number;
}

/**
 * Note interface based on OpenAPI schema
 */
export interface Note {
    id: number;
    title: string;
    body: string;
    category: Category;
    created_at: string;
    updated_at: string;
}

/**
 * Login response (token only)
 */
export interface LoginResponse {
    token: string;
}

/**
 * Generic API Error structure
 */
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
