import api from './api';

/**
 * Service để xử lý các API liên quan đến authentication
 */
const authApi = {
  /**
   * Đăng nhập với username và password
   * @param {string} username - Tên đăng nhập
   * @param {string} password - Mật khẩu
   * @returns {Promise} - Promise chứa kết quả đăng nhập từ server
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/v1/auth/login', { username, password });
      // API sẽ trả về dữ liệu với định dạng:
      // { status_code, error, details, message, data: { access_token, user_login } }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Đăng xuất người dùng hiện tại
   * @returns {Promise} - Promise chứa kết quả đăng xuất từ server
   */
  logout: async () => {
    try {
      const response = await api.post('/v1/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Làm mới access token bằng refresh token (được lưu trong cookie)
   * Chỉ được gọi tự động sau mỗi 30 phút sử dụng ứng dụng
   * @returns {Promise} - Promise chứa access token mới
   */
  refreshToken: async () => {
    try {
      const response = await api.get('/v1/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;