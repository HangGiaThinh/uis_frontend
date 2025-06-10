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
import { AuthProvider } from '../context/AuthContext';

function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<NotificationPanel />} />
                        <Route path="/dashboard" element={<NotificationPanel />} />
                        <Route
                            path="/profile"
                            element={<ProtectedRoute allowedRoles={['STUDENT', 'LECTURER', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT']} />}
                        >
                            <Route path="" element={<UserProfile />} />
                        </Route>
                        <Route
                            path="/user"
                            element={<ProtectedRoute allowedRoles={['STUDENT', 'LECTURER', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT']} />}
                        >
                            <Route path="" element={<UserInfoPanel />} />
                        </Route>
                        <Route
                            path="/students"
                            element={<ProtectedRoute allowedRoles={['EMPLOYEE_DEPARTMENT', 'EMPLOYEE_FACULTY']} />}
                        >
                            <Route path="" element={<StudentList />} />
                        </Route>
                        <Route
                            path="/scores"
                            element={<ProtectedRoute allowedRoles={['EMPLOYEE_DEPARTMENT', 'EMPLOYEE_FACULTY', 'LECTURER']} />}
                        >
                            <Route path="" element={<ScoreList />} />
                        </Route>
                        <Route
                            path="/complaints"
                            element={<ProtectedRoute allowedRoles={['EMPLOYEE_DEPARTMENT']} />}
                        >
                            <Route path="" element={<ComplaintList />} />
                        </Route>
                        <Route
                            path="/notifications"
                            element={<ProtectedRoute allowedRoles={['EMPLOYEE_DEPARTMENT', 'EMPLOYEE_FACULTY', 'LECTURER', 'STUDENT']} />}
                        >
                            <Route path="" element={<NotificationList />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default AppRoutes;