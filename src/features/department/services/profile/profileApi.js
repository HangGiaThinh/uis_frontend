import api from "../../../../services/api";

const profileApi = {
    getProfile: async () => {
        try {
            const response = await api.get("/v1/department/profile");
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin nhân viên phòng ban:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    updateProfile: async (data, avatar) => {
        try {
            if (avatar) {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formData.append(key, value);
                    }
                });
                formData.append('avatar', avatar);
                const response = await api.put("/v1/department/profile", formData, {
                    headers: {
                        // Không set Content-Type, axios sẽ tự set boundary cho multipart
                    },
                });
                return response.data.data;
            } else {
                const response = await api.put("/v1/department/profile", data);
                return response.data.data;
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin nhân viên phòng ban:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },
};

export default profileApi; 