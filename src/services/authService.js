import apiClient from '../config/api';

const authService = {
    async login(email, password) {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    async register(userData) {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    async forgotPassword(email) {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(token, newPassword, confirmPassword) {
        const response = await apiClient.post('/auth/reset-password', {
            token,
            newPassword,
            confirmPassword,
        });
        return response.data;
    },

    async changePassword(oldPassword, newPassword, confirmPassword) {
        const response = await apiClient.post('/auth/change-password', {
            oldPassword,
            newPassword,
            confirmPassword,
        });
        return response.data;
    },
};

export default authService;
