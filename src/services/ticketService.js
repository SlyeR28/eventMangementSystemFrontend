import apiClient from '../config/api';

const ticketService = {
    async getUserTickets(userId) {
        const response = await apiClient.get(`/tickets/user/${userId}`);
        return response.data;
    },

    async getTicketById(ticketId) {
        const response = await apiClient.get(`/tickets/${ticketId}`);
        return response.data;
    },

    async getTicketQR(ticketId) {
        const response = await apiClient.get(`/tickets/${ticketId}/qr`);
        return response.data;
    },
};

export default ticketService;
