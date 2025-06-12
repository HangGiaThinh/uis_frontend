import { api } from './authApi';

export const fetchUserProfile = async () => {
    try {
        const response = await api.get('/v1/student/profile'); // Sử dụng endpoint đúng
        return response.data;
    } catch (error) {
        throw new Error('Lỗi khi lấy thông tin người dùng: ' + error.message);
    }
};