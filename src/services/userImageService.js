import apiClient from '../config/api';

const userImageService = {
    async uploadUserImage(userId, imageFile) {
        // UserImageController: POST /api/user-image/{userId}
        const formData = new FormData();
        formData.append('file', imageFile);
        const response = await apiClient.post(`/user-image/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async getUserImage(userId) {
        // UserImageController: GET /api/user-image/{userId}
        const response = await apiClient.get(`/user-image/${userId}`);
        return response.data; // Returns the image URL string
    },

    async deleteUserImage(userId) {
        // UserImageController: DELETE /api/user-image/{userId}
        await apiClient.delete(`/user-image/${userId}`);
    }
};

export default userImageService;
