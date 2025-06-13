// src/features/student/services/profileApi.js
import api from "../../../../services/api";

const profileApi = {
    getProfile: async () => {
        try {
            console.log("Đang lấy token từ localStorage:", localStorage.getItem("token"));
            const response = await api.get("/v1/student/profile");
            console.log("Phản hồi từ API profile:", response.data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sinh viên:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },
};

export default profileApi;
