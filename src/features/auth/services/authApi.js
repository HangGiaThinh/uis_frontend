// src/features/auth/authApi.js
import api from "../../../services/api";

const login = async (username, password) => {
  console.log("Sending to /v1/auth/login:", { username, password });
  try {
    const response = await api.post("/v1/auth/login", { username, password });
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await api.post("/v1/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error;
  }
};

const fetchUserProfile = async (token) => {
  try {
    const response = await api.get("/v1/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User profile response:", response.data);
    return response.data.data; // Trả về response.data.data
  } catch (error) {
    console.error("Fetch user profile error:", error.response?.data || error.message);
    throw error;
  }
};

export { login, logout, fetchUserProfile };