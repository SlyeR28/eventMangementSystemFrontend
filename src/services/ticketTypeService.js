import apiClient from '../config/api';

const ticketTypeService = {
    async getTicketTypesByEvent(eventId) {
        // TicketTypeController: GET /api/ticket-types/event/{eventId}
        const response = await apiClient.get(`/ticket-types/event/${eventId}`);
        return response.data;
    },

    async createTicketType(ticketTypeData) {
        // TicketTypeController: POST /api/ticket-types/create
        const response = await apiClient.post('/ticket-types/create', ticketTypeData);
        return response.data;
    },

    async updateTicketType(ticketTypeId, ticketTypeData) {
        // TicketTypeController: PUT /api/ticket-types/update/{ticketTypeId}
        const response = await apiClient.put(`/ticket-types/update/${ticketTypeId}`, ticketTypeData);
        return response.data;
    },

    async deleteTicketType(ticketTypeId) {
        // TicketTypeController: DELETE /api/ticket-types/del/{ticketTypeId}
        await apiClient.delete(`/ticket-types/del/${ticketTypeId}`);
    },

    async getAllTicketTypes() {
        // TicketTypeController: GET /api/ticket-types/all
        const response = await apiClient.get('/ticket-types/all');
        return response.data;
    }
};

export default ticketTypeService;
