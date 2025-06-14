export const ROLES = {
  STUDENT: 'STUDENT',
  CLASS_COMMITTEE: 'CLASS_COMMITTEE',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN'
};

export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

export const COMPLAINT_STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  RESOLVED: 'Đã giải quyết',
  REJECTED: 'Từ chối'
};

export const COMPLAINT_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    REFRESH_TOKEN: '/v1/auth/refresh-token'
  },
  COMPLAINTS: {
    LIST: '/v1/student/complaints',
    DETAIL: (id) => `/v1/student/complaints/${id}`,
    CREATE: '/v1/student/complaints'
  },
  SCORES: {
    TRAINING_SCORES: '/v1/student/training-scores',
    TRAINING_SCORE_DETAIL: (id) => `/v1/student/training-scores/${id}`,
    SUBMIT_TRAINING_SCORE: (trainingScoreId) => `/v1/student/training-scores/${trainingScoreId}`
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  COMPLAINTS: {
    LIST: '/complaints',
    CREATE: '/complaints/create',
    DETAIL: (id) => `/complaints/${id}`
  }
}; 