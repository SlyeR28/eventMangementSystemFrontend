import apiClient from '../config/api';
import useAuthStore from '../store/authStore';

const eventService = {
    async searchEvents(filters) {
        // EventSearchController: POST /api/events/search
        const response = await apiClient.post('/events/search', filters);
        return response.data;
    },

    async fuzzySearch(keyword) {
        // EventSearchController: GET /api/events/fuzzy
        const response = await apiClient.get(`/events/fuzzy?keyword=${keyword}`);
        return response.data;
    },

    async getEventById(id) {
        // EventController: GET /api/event/get/{eventId}
        const response = await apiClient.get(`/event/get/${id}`);
        return response.data;
    },

    async createEvent(eventData) {
        // EventController: POST /api/event/create/{organizerId}
        const { user } = useAuthStore.getState();
        const response = await apiClient.post(`/event/create/${user.userId}`, eventData);
        return response.data;
    },

    async updateEvent(id, eventData) {
        // EventController: PUT /api/event/update/{organizerId}/{eventId}
        const { user } = useAuthStore.getState();
        const response = await apiClient.put(`/event/update/${user.userId}/${id}`, eventData);
        return response.data;
    },

    async deleteEvent(id) {
        // EventController: DELETE /api/event/delete/{organizerId}/{eventId}
        const { user } = useAuthStore.getState();
        await apiClient.delete(`/event/delete/${user.userId}/${id}`);
    },

    async publishEvent(id) {
        // EventController: PATCH /api/event/publish/{organizerId}/{eventId}
        const { user } = useAuthStore.getState();
        const response = await apiClient.patch(`/event/publish/${user.userId}/${id}`);
        return response.data;
    },

    async getEventsByOrganizer(organizerId) {
        // EventController: GET /api/event/organizer/{organizerId}
        const response = await apiClient.get(`/event/organizer/${organizerId}`);
        return response.data;
    },

    async getEventImages(eventId) {
        // EventImageController: GET /api/event-image/get/{eventId}
        const response = await apiClient.get(`/event-image/get/${eventId}`);
        return response.data;
    },

    async uploadEventImage(eventId, imageFiles) {
        // EventImageController: POST /api/event-image/upload/{eventId}
        const formData = new FormData();
        if (Array.isArray(imageFiles)) {
            imageFiles.forEach(file => formData.append('files', file));
        } else {
            formData.append('files', imageFiles);
        }
        const response = await apiClient.post(`/event-image/upload/${eventId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export default eventService;
