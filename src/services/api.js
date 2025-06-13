import axios from "axios";
import { isTokenExpired, updateLoginTimestamp } from "../features/auth/services/tokenUtils";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.request.use(
    async (config) => {
        console.log("Request config:", {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
        });

        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;

            if (isTokenExpired() && !config.url.includes("/auth/refresh-token")) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const response = await axios.get("/v1/auth/refresh-token", {
                            baseURL: "http://localhost:8080/api",
                            withCredentials: true,
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        const newToken = response.data?.data?.access_token;
                        if (!newToken) throw new Error("Không nhận được token mới");

                        localStorage.setItem("token", newToken);
                        updateLoginTimestamp();
                        config.headers.Authorization = `Bearer ${newToken}`;
                        processQueue(null, newToken);
                    } catch (error) {
                        console.error("Lỗi làm mới token:", {
                            message: error.message,
                            response: error.response?.data,
                            status: error.response?.status,
                        });
                        processQueue(error);
                        return Promise.reject(error);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            config.headers.Authorization = `Bearer ${token}`;
                            resolve(config);
                        },
                        reject,
                    });
                });
            }
        } else {
            console.warn("Không tìm thấy token trong localStorage");
        }

        return config;
    },
    (error) => {
        console.error("Lỗi interceptor request:", error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        if (response.config.url.includes("/auth/login") && response.data?.data?.access_token) {
            console.log("Lưu token từ login:", response.data.data.access_token);
            localStorage.setItem("token", response.data.data.access_token);
            updateLoginTimestamp();
        }
        return response;
    },
    (error) => {
        console.error("Lỗi API:", {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            details: error.response?.data,
        });
        // Không redirect, để lỗi được truyền về component
        return Promise.reject(error);
    }
);

export default api;