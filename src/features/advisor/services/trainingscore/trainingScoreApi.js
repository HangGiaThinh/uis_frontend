import api from '../../../../services/api';

const trainingScoreApi = {
  getSemesters: () => {
    return api.get('/v1/advisor/semesters');
  },

  getClassName: () => {
    return api.get('/v1/advisor/class-name');
  },

  getTrainingScores: (semesterId) => {
    return api.get(`/v1/advisor/training-scores?semesterId=${semesterId}`);
  },

  getStatistics: (semesterId) => {
    return api.get(`/v1/advisor/training-scores/statistics?semesterId=${semesterId}`);
  },
};

export default trainingScoreApi; 