import { mockComplaints } from './mockData'

export const getComplaints = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockComplaints
}

export const submitComplaint = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Mock submitted complaint:', data)
    return { success: true, message: 'Gửi khiếu nại thành công' }
}