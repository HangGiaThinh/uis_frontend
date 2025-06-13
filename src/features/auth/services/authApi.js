import api from "../../../services/api";

const login = async (username, password) => {
  console.log("Sending to /v1/auth/login:", { username, password });
  try {
    const response = await api.post("/v1/auth/login", { username, password });
    console.log("Server response:", response.data);
    if (response.data?.data?.access_token) {
      localStorage.setItem("token", response.data.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await api.post("/v1/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTimestamp");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error;
  }
};

const fetchUserProfile = async () => {
  try {
    const response = await api.get("/v1/student/profile");
    console.log("User profile response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Fetch user profile error:", error.response?.data || error.message);
    throw error;
  }
};

export { login, logout, fetchUserProfile };