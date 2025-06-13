import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/student';

const getToken = () => {
    // Giả lập lấy token từ localStorage hoặc context (thay bằng logic thực tế)
    return localStorage.getItem('token') || 'your-token-here';
};

export const getTrainingScores = async () => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/training-scores`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getTrainingScoreDetail = async (id) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/training-scores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const submitTrainingScore = async (trainingScoreId, data) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/training-scores/${trainingScoreId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};