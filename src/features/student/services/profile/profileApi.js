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

    updateProfile: async (data) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.put("/v1/student/profile", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin sinh viên:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },
    uploadAvatar: (formData) =>
        axios.put("/api/v1/student/profile?avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    changePassword: async (data) => {
        try {
            console.log("Đang lấy token từ localStorage:", localStorage.getItem("token"));
            const token = localStorage.getItem("token");
            const response = await api.put("/v1/student/change-password", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Phản hồi từ API đổi mật khẩu:", response.data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },


};

export default profileApi;
