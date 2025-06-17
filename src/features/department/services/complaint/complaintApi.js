import api from "../../../../services/api";

const complaintApi = {
    getComplaints: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/v1/department/complaints?page=${page}&size=${size}`);
            return response.data.data; // API trả về { meta, data: [] }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khiếu nại:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    getComplaintDetail: async (id) => {
        try {
            const response = await api.get(`/v1/department/complaints/${id}`);
            return response.data.data; // API trả về chi tiết khiếu nại
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết khiếu nại ${id}:`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    postComplaintResponse: async (id, responseData) => {
        try {
            const response = await api.post(`/v1/department/complaints/${id}`, responseData);
            return response.data.data;
        } catch (error) {
            console.error(`Lỗi khi gửi phản hồi khiếu nại ${id}:`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },
};

export default complaintApi; 