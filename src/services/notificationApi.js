import { mockNotifications, mockUser } from './mockData'

export const getNotifications = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockNotifications
}

export const getUserInfo = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockUser
}