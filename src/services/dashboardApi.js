import { mockDashboardStats } from './mockData'

// Comment API calls
/*
import api from './api'

export const getDashboardStats = async () => {
  const [studentCount, scoreAverage, pendingComplaints] = await Promise.all([
    api.get('/api/students/count'),
    api.get('/api/scores/average'),
    api.get('/api/complaints/pending/count'),
  ])
  return {
    studentCount: studentCount.data,
    scoreAverage: scoreAverage.data,
    pendingComplaints: pendingComplaints.data,
  }
}
*/

// Sử dụng mock data
export const getDashboardStats = async () => {
    // Giả lập độ trễ API
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockDashboardStats
}