import { mockScores, mockScoreForm } from './mockData'

export const getScores = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockScores
}

export const getScoreHistory = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    return mockScores.filter((score) => score.MaSV === userInfo.MaSV)
}

export const getScoreForm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockScoreForm
}

export const submitScoreForm = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Mock submitted score form:', data)
    return { success: true, message: 'Chấm điểm thành công' }
}