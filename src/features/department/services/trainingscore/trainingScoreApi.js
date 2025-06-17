import api from '../../../../services/api';

const trainingScoreApi = {
  getFaculties: () => {
    return api.get('/v1/department/faculties');
  },

  getClasses: (facultyId) => {
    return api.get(`/v1/department/classes?facultyId=${facultyId}`);
  },

  getSemesters: (classId) => {
    return api.get(`/v1/department/semesters?classId=${classId}`);
  },

  getTrainingScores: (classId, semesterId) => {
    return api.get(`/v1/department/training-scores?classId=${classId}&semesterId=${semesterId}`);
  },

  getStatistics: (classId, semesterId) => {
    return api.get(`/v1/department/training-scores/statistics?classId=${classId}&semesterId=${semesterId}`);
  },

  getTrainingScoreDetail: (id) => {
    return api.get(`/v1/department/training-scores/${id}`);
  },

  updateTrainingScore: (id, data) => {
    return api.put(`/v1/department/training-scores/${id}`, data);
  },

  approveAll: (classId, semesterId) => {
    return api.put(`/v1/department/training-scores/approve?classId=${classId}&semesterId=${semesterId}`);
  },

  // New APIs for creating and managing training scores
  getCurrentSemester: () => {
    return api.get('/v1/home/current-semester');
  },

  createTrainingScores: (data) => {
    return api.post('/v1/department/training-scores/create', data);
  },

  getTrainingScoreTime: (semesterId, classId = null) => {
    const params = new URLSearchParams({ semesterId });
    if (classId) {
      params.append('classId', classId);
    }
    return api.get(`/v1/department/training-scores/time?${params}`);
  },

  adjustTrainingScoreTime: (data) => {
    return api.put('/v1/department/training-scores/adjust-time', data);
  },
};

export default trainingScoreApi; 