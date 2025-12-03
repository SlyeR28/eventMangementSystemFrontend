import apiClient from '../config/api';

const cartService = {
    async getCart(userId) {
        const response = await apiClient.get(`/cart/user/${userId}`);
        return response.data;
    },

    async addToCart(userId, item) {
        const response = await apiClient.post(`/cart/user/${userId}/items`, item);
        return response.data;
    },

    async removeFromCart(userId, itemId) {
        await apiClient.delete(`/cart/user/${userId}/items/${itemId}`);
    },

    async updateQuantity(userId, itemId, quantity) {
        const response = await apiClient.put(`/cart/user/${userId}/items/${itemId}`, { quantity });
        return response.data;
    },

    async clearCart(userId) {
        await apiClient.delete(`/cart/user/${userId}/clear`);
    },
};

export default cartService;
