import apiClient from '../config/api';

const userService = {
    async updateUser(userId, userData) {
        // UserController: PUT /api/v1/user/update/{id}
        const response = await apiClient.put(`/v1/user/update/${userId}`, userData);
        return response.data;
    },

    async getUserById(userId) {
        // UserController: GET /api/v1/user/single/{id}
        const response = await apiClient.get(`/v1/user/single/${userId}`);
        return response.data;
    },

    async deleteUser(userId) {
        // UserController: DELETE /api/v1/user/del/{id}
        await apiClient.delete(`/v1/user/del/${userId}`);
    }
};

export default userService;
