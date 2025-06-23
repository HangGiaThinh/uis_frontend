import api from "../../../../services/api";
import axios from 'axios'; 

const announcementApi = {
    getAnnouncements: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/home/announcements?page=${page}&size=${size}`);
            return response.data.data; 
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thông báo:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    getAnnouncementDetail: async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/home/announcements/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết thông báo ${id}:`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    createAnnouncement: async (announcementData, attachment) => {
        try {
            const formData = new FormData();
            formData.append("title", announcementData.title);
            formData.append("content", announcementData.content);
            if (attachment) {
                formData.append("attachment", attachment);
            }
            const response = await api.post("/v1/department/announcements", formData, {
                headers: { 
                    // Axios sẽ tự động set 'Content-Type': 'multipart/form-data' với boundary phù hợp
                    // Không set Content-Type ở đây để tránh lỗi 415
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi tạo thông báo:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    updateAnnouncement: async (id, announcementData, attachment) => {
        try {
            const formData = new FormData();
            formData.append("title", announcementData.title);
            formData.append("content", announcementData.content);
            if (attachment) {
                formData.append("attachment", attachment);
            }
            const response = await api.put(`/v1/department/announcements/${id}`, formData, {
                headers: { 
                    // Axios sẽ tự động set 'Content-Type': 'multipart/form-data' với boundary phù hợp
                    // Không set Content-Type ở đây để tránh lỗi 415
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật thông báo:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    deleteAnnouncement: async (id) => {
        try {
            const response = await api.delete(`/v1/department/announcements/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Lỗi khi xóa thông báo ${id}:`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },
};

export default announcementApi; 