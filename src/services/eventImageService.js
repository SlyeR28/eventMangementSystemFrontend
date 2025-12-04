import apiClient from '../config/api';

const eventImageService = {
    async uploadEventImages(eventId, imageFiles) {
        // EventImageController: POST /api/event-image/upload/{eventId}
        const formData = new FormData();
        imageFiles.forEach((file) => {
            formData.append('files', file);
        });
        const response = await apiClient.post(`/event-image/upload/${eventId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async getEventImages(eventId) {
        // EventImageController: GET /api/event-image/get/{eventId}
        const response = await apiClient.get(`/event-image/get/${eventId}`);
        return response.data;
    },

    async getEventImagesPaginated(eventId, page = 0, size = 10, sortBy = 'uploadedAt', sortDir = 'desc') {
        // EventImageController: GET /api/event-image/get-by/{eventId}
        const response = await apiClient.get(`/event-image/get-by/${eventId}`, {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    async deleteAllEventImages(eventId) {
        // EventImageController: DELETE /api/event-image/del/{eventId}
        await apiClient.delete(`/event-image/del/${eventId}`);
    },

    async deleteEventImage(eventId, publicId) {
        // EventImageController: DELETE /api/event-image/delete/{eventId}/{publicId}
        await apiClient.delete(`/event-image/delete/${eventId}/${publicId}`);
    }
};

export default eventImageService;
