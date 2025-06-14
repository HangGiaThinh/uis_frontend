import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/student';

const getToken = () => {
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
    const currentDate = new Date().toISOString(); // Lấy ngày hiện tại (12:44 AM +07, 14/06/2025)
    const payload = {
        ...data,
        student_submission_date: currentDate, // Thêm ngày sinh viên chấm
        status: 'WAIT_CLASS_COMMITTEE', // Chuyển trạng thái
    };
    const response = await axios.post(`${API_URL}/training-scores/${trainingScoreId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
