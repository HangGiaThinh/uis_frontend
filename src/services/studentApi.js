import { mockStudents } from './mockData'

export const getStudents = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockStudents
}