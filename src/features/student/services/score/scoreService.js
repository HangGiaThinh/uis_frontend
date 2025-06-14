import api from '../../../../services/api';
import { API_ENDPOINTS } from '../../../../constants';

const getToken = () => {
    return localStorage.getItem('token') || 'your-token-here';
};

export const getTrainingScores = async () => {
    const url = API_ENDPOINTS.SCORES.TRAINING_SCORES;
    console.log('Fetching training scores from URL:', api.defaults.baseURL + url);
    const response = await api.get(url);
    return response.data.data;
};

export const getTrainingScoreDetail = async (id) => {
    const response = await api.get(API_ENDPOINTS.SCORES.TRAINING_SCORE_DETAIL(id));
    return response.data.data;
};

export const submitTrainingScore = async (trainingScoreId, data) => {
    const currentDate = new Date().toISOString();
    const payload = {
        ...data,
        student_submission_date: currentDate,
        status: 'WAIT_CLASS_COMMITTEE',
    };
    const response = await api.post(API_ENDPOINTS.SCORES.SUBMIT_TRAINING_SCORE(trainingScoreId), payload);
    return response.data;
};
