import { mockUser, mockScoreForm } from './mockData'

export const getUserProfile = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockUser
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

export const updateUserProfile = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Mock updated user profile:', data)
    return { success: true, message: 'Cập nhật thông tin thành công', updatedUser: data }
}