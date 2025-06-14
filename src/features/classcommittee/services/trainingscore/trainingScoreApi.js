import api from '../../../../services/api';

const trainingScoreApi = {
  getSemesters: () => {
    return api.get('/v1/class-committee/semesters');
  },

  getClassName: () => {
    return api.get('/v1/class-committee/class-name');
  },

  getTrainingScores: (semesterId) => {
    return api.get(`/v1/class-committee/training-scores?semesterId=${semesterId}`);
  },
};

export default trainingScoreApi; 