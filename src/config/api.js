import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized or 403 with JWT expired - redirect to login
            if (error.response.status === 401 ||
                (error.response.status === 403 && error.response.data?.message?.includes('JWT expired'))) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            // Handle other 403 Forbidden
            if (error.response.status === 403) {
                console.error('Access denied:', error.response.data?.message || 'Forbidden');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
