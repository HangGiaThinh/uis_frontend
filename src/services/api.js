import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Thay bằng URL backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
})

// Thêm interceptor để xử lý token (nếu có)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') // Lấy token từ localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api