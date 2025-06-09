import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import NotificationPanel from '../features/notification/NotificationPanel';
import UserInfoPanel from '../features/user/UserInfoPanel';
import UserProfile from '../features/user/UserProfile';
import StudentList from '../features/student/StudentList';
import ScoreList from '../features/score/ScoreList';
import ComplaintList from '../features/complaint/ComplaintList';
import NotificationList from '../features/notification/NotificationList';
import ProtectedRoute from '../components/ProtectedRoute';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<NotificationPanel />} />
                    <Route path="/dashboard" element={<NotificationPanel />} />
                    <Route
                        path="/profile"
                        element={<ProtectedRoute allowedRoles={['SinhVien', 'BanCanSu', 'GiangVien']} />}
                    >
                        <Route path="" element={<UserProfile />} />
                    </Route>
                    <Route
                        path="/user"
                        element={<ProtectedRoute allowedRoles={['SinhVien', 'BanCanSu', 'GiangVien']} />}
                    >
                        <Route path="" element={<UserInfoPanel />} />
                    </Route>
                    <Route
                        path="/students"
                        element={<ProtectedRoute allowedRoles={['NhanVienCTSV', 'NhanVienKhoa']} />}
                    >
                        <Route path="" element={<StudentList />} />
                    </Route>
                    <Route
                        path="/scores"
                        element={<ProtectedRoute allowedRoles={['NhanVienCTSV', 'NhanVienKhoa', 'GiangVien', 'BanCanSu']} />}
                    >
                        <Route path="" element={<ScoreList />} />
                    </Route>
                    <Route
                        path="/complaints"
                        element={<ProtectedRoute allowedRoles={['NhanVienCTSV']} />}
                    >
                        <Route path="" element={<ComplaintList />} />
                    </Route>
                    <Route
                        path="/notifications"
                        element={<ProtectedRoute allowedRoles={['NhanVienCTSV', 'NhanVienKhoa', 'GiangVien', 'SinhVien', 'BanCanSu']} />}
                    >
                        <Route path="" element={<NotificationList />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;