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

    updateProfile: async (data, avatarFile = null) => {
        try {
            const token = localStorage.getItem("token");
            
            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);
                
                // Upload avatar first
                await api.put("/v1/student/profile", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    params: { avatar: true }
                });
            }
            
            // Update profile data
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
    
    getAcademicResults: async () => {
        try {
            const response = await api.get("/v1/student/academic-results");
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy kết quả học tập:", error);
            throw error;
        }
    },
    
    getAverageGPA: async () => {
        try {
            const response = await api.get("/v1/student/average-gpa");
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy GPA trung bình:", error);
            throw error;
        }
    },

    uploadAvatar: (formData) =>
        api.put("/v1/student/profile?avatar", formData, {
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
