import api from '../../../../services/api';

const trainingScoreApi = {
  getClasses: () => {
    return api.get('/v1/faculty/classes');
  },

  getSemesters: (classId) => {
    return api.get(`/v1/faculty/semesters?classId=${classId}`);
  },

  getTrainingScores: (classId, semesterId) => {
    return api.get(`/v1/faculty/training-scores?classId=${classId}&semesterId=${semesterId}`);
  },

  getStatistics: (classId, semesterId) => {
    return api.get(`/v1/faculty/training-scores/statistics?classId=${classId}&semesterId=${semesterId}`);
  },

  getTrainingScoreDetail: (id) => {
    return api.get(`/v1/faculty/training-scores/${id}`);
  },

  updateTrainingScore: (id, data) => {
    return api.post(`/v1/faculty/training-scores/${id}`, data);
  },

  approveAll: (classId, semesterId) => {
    return api.put(`/v1/faculty/training-scores/approve?classId=${classId}&semesterId=${semesterId}`);
  },
};

export default trainingScoreApi; 