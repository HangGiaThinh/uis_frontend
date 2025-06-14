import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './router/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ROLES, ROUTES } from './constants';
import MainLayout from "./components/user/layout/MainLayout";
import StudentProfilePage from "./features/student/pages/profile/StudentProfilePage";
import UserInfoPanel from "./features/user/UserInfoPanel";
import StudentAcademicResultsPage from "./features/student/pages/academic/StudentAcademicResultsPage";
import ChangePasswordPage from "./features/student/pages/profile/ChangePasswordPage";

// Directly import components
import LoginPage from './features/auth/pages/LoginPage';
import HomePage from './features/user/pages/HomePage';
import ScorePage from './features/student/pages/score/ScorePage';
import ScoreDetailPage from './features/student/pages/score/ScoreDetailPage';
import ComplaintPage from './features/student/pages/complaint/ComplaintPage';
import ComplaintDetailPage from './features/student/pages/complaint/ComplaintDetailPage';
import CreateComplaintForm from './features/student/components/complaint/CreateComplaintForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route element={<MainLayout />}>
                {/* Public routes */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                
                {/* Protected routes */}
                <Route path={ROUTES.HOME} element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <HomePage />
                  </ProtectedRoute>
                } />

                <Route path="/scores" element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <ScorePage />
                  </ProtectedRoute>
                } />

                <Route path="/scores/:id" element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <ScoreDetailPage />
                  </ProtectedRoute>
                } />

                <Route path={ROUTES.COMPLAINTS.LIST} element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <ComplaintPage />
                  </ProtectedRoute>
                } />

                <Route path={ROUTES.COMPLAINTS.DETAIL(':id')} element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <ComplaintDetailPage />
                  </ProtectedRoute>
                } />

                <Route path={ROUTES.COMPLAINTS.CREATE} element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <CreateComplaintForm />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <StudentProfilePage />
                  </ProtectedRoute>
                } />

                <Route path="/user" element={
                  <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE_FACULTY, ROLES.EMPLOYEE_DEPARTMENT]}>
                    <UserInfoPanel />
                  </ProtectedRoute>
                } />

                <Route path="/academic-results" element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <StudentAcademicResultsPage />
                  </ProtectedRoute>
                } />

                <Route path="/change-password" element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.CLASS_COMMITTEE]}>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                } />

                {/* Default route */}
                <Route index element={<Navigate to={ROUTES.HOME} replace />} />
              </Route>
            </Routes>
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;