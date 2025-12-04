import apiClient from '../config/api';

const orderService = {
    async createOrder(userId) {
        // OrderController: POST /api/orders/{userId}/checkOut
        // This creates an order from the user's cart
        const response = await apiClient.post(`/orders/${userId}/checkOut`);
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

    async createPayment(paymentRequest, provider = 'razorpay') {
        // PaymentController: POST /api/payments/create/{provider}
        const response = await apiClient.post(`/payments/create/${provider}`, paymentRequest);
        return response.data;
    },

    async verifyPayment(orderId, providerPaymentId, providerSignature, provider = 'razorpay') {
        // PaymentController: POST /api/payments/{provider}/verify
        const response = await apiClient.post(`/payments/${provider}/verify`, null, {
            params: {
                orderId,
                providerPaymentId,
                providerSignature
            }
        });
        return response.data;
    },

    async updateOrderStatus(orderId, status) {
        const response = await apiClient.put(`/orders/${orderId}/status`, { status });
        return response.data;
    },
};

export default orderService;
