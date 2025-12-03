import apiClient from '../config/api';

const orderService = {
    async createOrder(userId, orderData) {
        const response = await apiClient.post(`/orders/user/${userId}`, orderData);
        return response.data;
    },

    async getOrders(userId) {
        const response = await apiClient.get(`/orders/user/${userId}`);
        return response.data;
    },

    async getOrderById(orderId) {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response.data;
    },
};

export default orderService;
