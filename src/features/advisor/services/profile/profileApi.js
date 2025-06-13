import api from "../../../../services/api";

const profileApi = {
    getProfile: async () => {
        try {
            const response = await api.get("/v1/advisor/profile");
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin giảng viên:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    updateProfile: async (data, avatar) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== null) {
                    formData.append(key, value.toString());
                }
            });
            
            if (avatar) {
                formData.append('avatar', avatar);
            }

            const response = await api.put("/v1/advisor/profile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin giảng viên:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },
};

export default profileApi; 