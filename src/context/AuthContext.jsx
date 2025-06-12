import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authApi from '../services/authApi';
import { fetchUserProfile } from '../services/userService'; // Thêm import này

// Tạo context cho authentication
const AuthContext = createContext();

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);

// Các role được chuyển hướng đến /profile
const PROFILE_REDIRECT_ROLES = ['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'];

// Route và phân quyền tương ứng
const routePermissions = {
  '/profile': ['STUDENT', 'LECTURER', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'],
  '/user': ['EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'],
  '/students': ['EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'],
  '/scores': ['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'],
  '/scores:id': ['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'],
  '/complaints': ['EMPLOYEE_DEPARTMENT'],
  '/notifications': ['STUDENT', 'LECTURER', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'],
  '/dashboard': ['STUDENT', 'LECTURER', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'],
};

// Provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userProfile = await fetchUserProfile(); // Gọi fetchUserProfile
        if (userProfile && userProfile.data) {
          const userInfo = userProfile.data;
          const userRole = userInfo.studentAccount ? 'STUDENT' : null; // Xác định role
          const userPosition = null; // Có thể điều chỉnh nếu có trường position
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem('role', userRole);
          localStorage.setItem('position', userPosition || '');
          setUser(userInfo);
          setRole(userRole);
          setPosition(userPosition || '');
        } else {
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

  // Kiểm tra và điều hướng dựa trên quyền khi route thay đổi
  useEffect(() => {
    if (!loading && role) {
      const currentPath = location.pathname;
      const allowedRoles = routePermissions[currentPath] || [];
      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        navigate('/'); // Nếu role không có quyền, quay về /
      }
    }
  }, [loading, role, location.pathname, navigate]);

  // Xử lý đăng nhập
  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(username, password);
      if (response && response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('loginTimestamp', Date.now().toString());
        const userInfo = response.data.user_login;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        const userRole = userInfo.role;
        const userPosition = userInfo.position || '';
        localStorage.setItem('role', userRole);
        localStorage.setItem('position', userPosition);

        setUser(userInfo);
        setRole(userRole);
        setPosition(userPosition);

        return { success: true, user: userInfo, role: userRole };
      } else {
        throw new Error('Đăng nhập không thành công: Phản hồi không hợp lệ');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      // Log detailed server response if available
      if (err.response) {
        console.error('Server response:', err.response.data);
        console.error('Status:', err.response.status);
        console.error('Headers:', err.response.headers);
      }
      let errorMessage = err.response?.data?.message || 'Vui lòng kiểm tra tên đăng nhập hoặc mật khẩu';
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
      if (callApi) {
        await authApi.logout();
      }
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('role');
      localStorage.removeItem('position');
      localStorage.removeItem('loginTimestamp');

      setUser(null);
      setRole(null);
      setPosition(null);
      setLoading(false);

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