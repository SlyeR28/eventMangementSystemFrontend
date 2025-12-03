import apiClient from '../config/api';

const eventService = {
    async searchEvents(filters) {
        const response = await apiClient.post('/events/search', filters);
        return response.data;
    },

    async fuzzySearch(keyword) {
        const response = await apiClient.get(`/events/fuzzy?keyword=${keyword}`);
        return response.data;
    },

    async getEventById(id) {
        const response = await apiClient.get(`/events/${id}`);
        return response.data;
    },

    async createEvent(eventData) {
        const response = await apiClient.post('/events', eventData);
        return response.data;
    },

    async updateEvent(id, eventData) {
        const response = await apiClient.put(`/events/${id}`, eventData);
        return response.data;
    },

    async deleteEvent(id) {
        await apiClient.delete(`/events/${id}`);
    },

    async publishEvent(id) {
        const response = await apiClient.post(`/events/${id}/publish`);
        return response.data;
    },

    async getEventsByOrganizer(organizerId) {
        const response = await apiClient.get(`/events/organizer/${organizerId}`);
        return response.data;
    },

    async uploadEventImage(eventId, imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await apiClient.post(`/event-images/event/${eventId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export default eventService;
