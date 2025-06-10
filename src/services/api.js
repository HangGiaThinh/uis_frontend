import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Thay bằng URL backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Quan trọng để gửi và nhận cookie
})

// Lưu thời gian đăng nhập
let loginTimestamp = null;
// Thời gian hết hạn token (30 phút = 1800000 ms)
const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 phút

// Kiểm tra xem token có cần được làm mới không
const isTokenExpired = () => {
    if (!loginTimestamp) {
        // Nếu không có timestamp, lấy từ localStorage (nếu có)
        const savedTimestamp = localStorage.getItem('loginTimestamp');
        if (savedTimestamp) {
            loginTimestamp = parseInt(savedTimestamp, 10);
        } else {
            return false;
        }
    }
    
    // Kiểm tra xem đã hơn 30 phút kể từ lần đăng nhập/làm mới cuối chưa
    const currentTime = Date.now();
    return currentTime - loginTimestamp > TOKEN_EXPIRATION_TIME;
};

// Cập nhật thời gian đăng nhập/làm mới
const updateLoginTimestamp = () => {
    loginTimestamp = Date.now();
    localStorage.setItem('loginTimestamp', loginTimestamp.toString());
};

// Flag để kiểm tra xem đang refresh token hay không
let isRefreshing = false;
// Hàng đợi các request đang chờ refresh token
let failedQueue = [];

// Xử lý các request trong hàng đợi
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// Thêm interceptor để xử lý token
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    
    // Nếu có token và token đã hết hạn, thực hiện refresh
    if (token && isTokenExpired() && !config.url.includes('/auth/refresh-token')) {
        // Tránh refresh token khi đang gọi API refresh token
        if (!isRefreshing) {
            isRefreshing = true;
            
            try {
                const response = await axios.get('http://localhost:8080/api/v1/auth/refresh-token', {
                    withCredentials: true
                });
                
                if (response.data && response.data.data && response.data.data.access_token) {
                    const newToken = response.data.data.access_token;
                    localStorage.setItem('token', newToken);
                    updateLoginTimestamp();
                    
                    // Cập nhật token cho request hiện tại
                    config.headers.Authorization = `Bearer ${newToken}`;
                } else {
                    // Nếu refresh token thất bại, đăng xuất người dùng
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('role');
                    localStorage.removeItem('loginTimestamp');
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Refresh token error:', error);
                // Đăng xuất người dùng
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                localStorage.removeItem('role');
                localStorage.removeItem('loginTimestamp');
                window.location.href = '/';
            } finally {
                isRefreshing = false;
            }
        }
    }
    
    // Thêm token vào header nếu có
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

// Xử lý response
api.interceptors.response.use(
    (response) => {
        // Nếu đăng nhập thành công, cập nhật timestamp
        if (response.config.url.includes('/auth/login') && response.data?.data?.access_token) {
            updateLoginTimestamp();
        }
        return response;
    },
    (error) => {
        // Nếu lỗi 401 (Unauthorized), đăng xuất người dùng
        if (error.response && error.response.status === 401 && 
            !error.config.url.includes('/auth/login') && 
            !error.config.url.includes('/auth/refresh-token')) {
            
            // Đăng xuất người dùng
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('role');
            localStorage.removeItem('loginTimestamp');
            
            // Chuyển hướng đến trang chính
            window.location.href = '/';
        }
        
        return Promise.reject(error);
    }
);

export default api