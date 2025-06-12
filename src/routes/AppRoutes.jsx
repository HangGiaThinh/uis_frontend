import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/user/layout/MainLayout';
import NotificationPanel from '../features/notification/NotificationPanel';
import UserInfoPanel from '../features/user/UserInfoPanel';
import UserProfile from '../features/user/UserProfile';
import StudentList from '../features/student/StudentList';
import ScorePage from '../features/score/pages/ScorePage'; // Cập nhật import
import ScoreDetailPage from '../features/score/pages/ScoreDetailPage'; // Cập nhật import
import ComplaintList from '../features/complaint/ComplaintList';
import NotificationList from '../features/notification/NotificationList';
import { AuthProvider } from '../context/AuthContext';

function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<NotificationPanel />} />
                        <Route path="/dashboard" element={<NotificationPanel />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/user" element={<UserInfoPanel />} />
                        <Route path="/students" element={<StudentList />} />
                        <Route path="/scores" element={<ScorePage />} />
                        <Route path="/scores/:id" element={<ScoreDetailPage />} />
                        <Route path="/complaints" element={<ComplaintList />} />
                        <Route path="/notifications" element={<NotificationList />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default AppRoutes;