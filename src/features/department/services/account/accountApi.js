import api from "../../../../services/api";

const accountApi = {
    getAccounts: async (page = 0, size = 10) => {
        try {
            const response = await api.get(`/v1/department/accounts?page=${page}&size=${size}`);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tài khoản:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    createAccount: async (accountData) => {
        try {
            const response = await api.post("/v1/department/accounts", accountData);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi tạo tài khoản:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    updateAccount: async (accountData) => {
        try {
            const response = await api.put("/v1/department/accounts", accountData);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },

    deleteAccount: async (id) => {
        try {
            const response = await api.delete(`/v1/department/accounts/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi xóa tài khoản:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error;
        }
    },
};

export default accountApi; 