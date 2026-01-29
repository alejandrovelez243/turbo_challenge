import axios from 'axios';
import Cookies from 'js-cookie';

// Using proxy or direct URL based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Authorization token
client.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// Optional: Interceptor to handle errors centrally
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Logout user or redirect to login
            Cookies.remove('token');
            if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
