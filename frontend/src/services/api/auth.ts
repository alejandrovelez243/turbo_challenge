import { client } from './client';
import { User, LoginResponse } from '@/types';
import Cookies from 'js-cookie';

interface LoginData {
    email: string;
    password: string;
}

/**
 * Login user and store token
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>('/auth/login/', data);
    if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 7 }); // Store for 7 days
    }
    return response.data;
};

/**
 * Sign up new user (Simplified: Email and Password)
 */
export const signup = async (data: { email: string; password: string }): Promise<User> => {
    const response = await client.post<User>('/auth/signup/', data);
    return response.data;
};

/**
 * Logout user
 */
export const logout = () => {
    Cookies.remove('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!Cookies.get('token');
};
