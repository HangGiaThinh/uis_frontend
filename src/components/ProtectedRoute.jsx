import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, checkPermission, loading } = useAuth()

    // Nếu đang loading, hiển thị trạng thái loading hoặc không hiển thị gì
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // Nếu chưa đăng nhập, chuyển hướng đến trang chính
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    // Nếu không có quyền truy cập, chuyển hướng đến trang dashboard
    if (allowedRoles && !checkPermission(allowedRoles)) {
        return <Navigate to="/dashboard" replace />
    }

    // Nếu đã đăng nhập và có quyền truy cập, hiển thị nội dung
    return <Outlet />
}

export default ProtectedRoute