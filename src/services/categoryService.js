import apiClient from '../config/api';

const categoryService = {
    async getAllCategories() {
        // Assuming backend has GET /api/categories endpoint
        const response = await apiClient.get('/categories');
        return response.data;
    },

    async getCategoryById(id) {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },

    async getEventsByCategory(categoryId) {
        const response = await apiClient.get(`/categories/${categoryId}/events`);
        return response.data;
    }
};

export default categoryService;
