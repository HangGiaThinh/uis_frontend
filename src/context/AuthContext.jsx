import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../features/auth/services/authApi';

// Tạo context cho authentication
const AuthContext = createContext();

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);

// Các role được chuyển hướng đến /profile
const PROFILE_REDIRECT_ROLES = ['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'];

// Provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Kiểm tra xem có token trong localStorage không
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Lấy thông tin user từ localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const userRole = localStorage.getItem('role');
        const userPosition = localStorage.getItem('position');

        if (userInfo && userRole) {
          setUser(userInfo);
          setRole(userRole);
          setPosition(userPosition || '');
        } else {
          // Nếu không có thông tin user, xóa dữ liệu
          handleLogout(false);
        }
      } catch (err) {
        console.error('Lỗi kiểm tra trạng thái đăng nhập:', err);
        setError('Không thể xác thực. Vui lòng đăng nhập lại.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Xử lý đăng nhập
  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(username, password);

      if (response && response.data && response.data.access_token) {
        // Lưu token
        localStorage.setItem('token', response.data.access_token);

        // Lưu thời gian đăng nhập
        localStorage.setItem('loginTimestamp', Date.now().toString());

        // Lưu thông tin user
        const userInfo = response.data.user_login;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Lưu role và position
        const userRole = userInfo.role;
        const userPosition = userInfo.position || '';

        localStorage.setItem('role', userRole);
        localStorage.setItem('position', userPosition);

        setUser(userInfo);
        setRole(userRole);
        setPosition(userPosition);

        return { success: true, user: userInfo, role: userRole };
      } else {
        throw new Error('Đăng nhập không thành công');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);

      let errorMessage = 'Vui lòng kiểm tra tên đăng nhập hoặc mật khẩu';

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async (callApi = true) => {
    setLoading(true);

    try {
      // Gọi API đăng xuất nếu cần
      if (callApi) {
        await authApi.logout();
      }
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    } finally {
      // Xóa dữ liệu khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('role');
      localStorage.removeItem('position');
      localStorage.removeItem('loginTimestamp');

      // Reset state
      setUser(null);
      setRole(null);
      setPosition(null);
      setLoading(false);

      // Chuyển hướng về trang chính
      navigate('/');
    }
  };

  // Kiểm tra xem người dùng có quyền truy cập không
  const checkPermission = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!role) return false;

    return requiredRoles.includes(role);
  };

  // Kiểm tra xem role hiện tại có nên chuyển hướng đến /profile không
  const shouldRedirectToProfile = () => {
    return PROFILE_REDIRECT_ROLES.includes(role);
  };

  // Giá trị được cung cấp cho context
  const value = {
    user,
    role,
    position,
    loading,
    error,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    checkPermission,
    shouldRedirectToProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;