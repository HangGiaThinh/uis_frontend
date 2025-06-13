// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api", // Đảm bảo đúng với cấu hình backend
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        console.log("Request config:", config); // Log để debug
        return config;
    },
    (error) => Promise.reject(error)
);

// Lưu thời gian đăng nhập
let loginTimestamp = null;
const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 phút

const isTokenExpired = () => {
    if (!loginTimestamp) {
        const savedTimestamp = localStorage.getItem("loginTimestamp");
        if (savedTimestamp) {
            loginTimestamp = parseInt(savedTimestamp, 10);
        } else {
            return false;
        }
    }
    const currentTime = Date.now();
    return currentTime - loginTimestamp > TOKEN_EXPIRATION_TIME;
};

const updateLoginTimestamp = () => {
    loginTimestamp = Date.now();
    localStorage.setItem("loginTimestamp", loginTimestamp.toString());
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token");

        if (token && isTokenExpired() && !config.url.includes("/auth/refresh-token")) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const response = await axios.get("/v1/auth/refresh-token", {
                        baseURL: "http://localhost:8080/api", // Đảm bảo baseURL khớp
                        withCredentials: true,
                    });
                    if (response.data && response.data.data && response.data.data.access_token) {
                        const newToken = response.data.data.access_token;
                        localStorage.setItem("token", newToken);
                        updateLoginTimestamp();
                        config.headers.Authorization = `Bearer ${newToken}`;
                    } else {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userInfo");
                        localStorage.removeItem("role");
                        localStorage.removeItem("loginTimestamp");
                        window.location.href = "/";
                    }
                } catch (error) {
                    console.error("Refresh token error:", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("userInfo");
                    localStorage.removeItem("role");
                    localStorage.removeItem("loginTimestamp");
                    window.location.href = "/";
                } finally {
                    isRefreshing = false;
                    processQueue(null, localStorage.getItem("token"));
                }
            }
            const retryProm = new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            });
            retryProm.then((token) => {
                config.headers.Authorization = `Bearer ${token}`;
            }).catch((err) => {
                throw err;
            });
            return retryProm;
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        if (response.config.url.includes("/auth/login") && response.data?.data?.access_token) {
            updateLoginTimestamp();
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401 &&
            !error.config.url.includes("/auth/login") &&
            !error.config.url.includes("/auth/refresh-token")) {
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("role");
            localStorage.removeItem("loginTimestamp");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;