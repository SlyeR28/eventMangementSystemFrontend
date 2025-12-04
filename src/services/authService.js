import apiClient from '../config/api';

const authService = {
    async login(email, password) {
        // AuthController: POST /api/v1/auth/login
        const response = await apiClient.post('/v1/auth/login', { email, password });
        return response.data;
    },

    async register(userData) {
        // UserController: POST /api/v1/user/register
        const response = await apiClient.post('/v1/user/register', userData);
        return response.data;
    },

    async forgotPassword(email) {
        // AuthController: POST /api/v1/auth/forgot-password
        const response = await apiClient.post('/v1/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(token, newPassword, confirmPassword) {
        // AuthController: POST /api/v1/auth/reset-password
        const response = await apiClient.post('/v1/auth/reset-password', {
            token,
            newPassword,
            confirmPassword,
        });
        return response.data;
    },

    async changePassword(oldPassword, newPassword, confirmPassword) {
        // AuthController: POST /api/v1/auth/change-password
        const response = await apiClient.post('/v1/auth/change-password', {
            oldPassword,
            newPassword,
            confirmPassword,
        });
        return response.data;
    },
};

export default authService;
