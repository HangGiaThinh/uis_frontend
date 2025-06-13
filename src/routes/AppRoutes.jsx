import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import NotificationPanel from '../features/home/notification/NotificationPanel';
import UserInfoPanel from '../features/home/UserInfoPanel';
import UserProfile from '../features/student/profile/UserProfile';
import ScoreList from '../features/student/trainingscore/ScoreList';
import ComplaintList from '../features/student/complaint/ComplaintList';
import NotificationList from '../features/home/notification/NotificationList';
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
                            element={<ProtectedRoute allowedRoles={['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT']} />}
                        >
                            <Route path="" element={<UserProfile />} />
                        </Route>
                        <Route
                            path="/user"
                            element={<ProtectedRoute allowedRoles={['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT']} />}
                        >
                            <Route path="" element={<UserInfoPanel />} />
                        </Route>
                        <Route
                            path="/students"
                            element={<ProtectedRoute allowedRoles={['EMPLOYEE_DEPARTMENT', 'EMPLOYEE_FACULTY', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR']} />}
                        >
                        </Route>
                        <Route
                            path="/scores"
                            element={<ProtectedRoute allowedRoles={["STUDENT", 'EMPLOYEE_DEPARTMENT', 'EMPLOYEE_FACULTY', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR']} />}
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
                            element={<ProtectedRoute allowedRoles={['EMPLOYEE_DEPARTMENT', 'EMPLOYEE_FACULTY', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'STUDENT']} />}
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