import api from "../../../../services/api";

const fetchUserAcademicResults = async () => {
    try {
        const response = await api.get("/v1/student/academic-results");
        console.log("User academic results response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Fetch user academic results error:", error.message);
        throw error;
    }
};
const fetchAverageGPA = async () => {
    const response = await api.get("/v1/student/average-gpa");
    return response.data.data; // Vì data nằm trong .data.data
};

export { fetchUserAcademicResults, fetchAverageGPA };