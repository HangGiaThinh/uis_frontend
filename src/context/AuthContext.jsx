// src/features/auth/AuthContext.jsx
import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout, fetchUserProfile } from "../features/auth/services/authApi";
import { isTokenExpired, updateLoginTimestamp } from "../features/auth/services/tokenUtils";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token && isTokenExpired()) {
          await logout();
          localStorage.removeItem("token");
          return;
        }
        if (token) {
          const userProfile = await fetchUserProfile(token);
          console.log("User profile:", userProfile);
          if (!userProfile?.user_login || !userProfile.user_login.role) {
            throw new Error("Dữ liệu hồ sơ người dùng không hợp lệ");
          }
          setUser(userProfile.user_login);
          setRole(userProfile.user_login.role);
        }
      } catch (err) {
        console.error("Kiểm tra xác thực thất bại:", err.message);
        setError("Không thể tải thông tin người dùng");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Đang thử đăng nhập với:", { username, password });
      const response = await login(username, password);
      console.log("Full login response:", JSON.stringify(response, null, 2));
      if (response?.data?.access_token) {
        if (!response.data.user_login || !response.data.user_login.role) {
          throw new Error("Dữ liệu người dùng hoặc vai trò không hợp lệ");
        }
        localStorage.setItem("token", response.data.access_token);
        updateLoginTimestamp();
        setUser(response.data.user_login);
        setRole(response.data.user_login.role);
        return { success: true, role: response.data.user_login.role };
      } else {
        throw new Error("Không nhận được token đăng nhập");
      }
    } catch (err) {
      console.error("Đăng nhập thất bại:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setRole(null);
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Đăng xuất thất bại:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = (requiredRoles) => requiredRoles.includes(role);

  const value = {
    user,
    role,
    loading,
    error,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};