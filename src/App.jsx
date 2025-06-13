// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/user/layout/MainLayout'
import HomePage from './features/HomePage';
import StudentProfilePage from './features/student/pages/profile/StudentProfilePage';
import UserInfoPanel from './features/user/UserInfoPanel';
import ScorePage from './features/student/pages/score/ScorePage';
import ScoreDetailPage from './features/student/pages/score/ScoreDetailPage';
import ProtectedRoute from './router/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={<ProtectedRoute allowedRoles={['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT']} />}
          >
            <Route path="/profile" element={<StudentProfilePage />} />
          </Route>
          <Route
            path="/user"
            element={<ProtectedRoute allowedRoles={['EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT']} />}
          >
            <Route path="/user" element={<UserInfoPanel />} />
          </Route>
          <Route
            path="/scores"
            element={<ProtectedRoute allowedRoles={['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT']} />}
          >
            <Route path="/scores" element={<ScorePage />} />
          </Route>
          <Route
            path="/scores/:id"
            element={<ProtectedRoute allowedRoles={['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT']} />}
          >
            <Route path="/scores/:id" element={<ScoreDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;