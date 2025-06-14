import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/user/layout/MainLayout";
import StudentProfilePage from "./features/student/pages/profile/StudentProfilePage";
import AdvisorProfilePage from "./features/advisor/pages/profile/AdvisorProfilePage";
import FacultyProfilePage from "./features/faculty/pages/profile/FacultyProfilePage";
import DepartmentProfilePage from "./features/department/pages/profile/DepartmentProfilePage";
import UserInfoPanel from "./features/user/UserInfoPanel";
import ScorePage from "./features/student/pages/score/ScorePage";
import ScoreDetailPage from "./features/student/pages/score/ScoreDetailPage";
import StudentAcademicResultsPage from "./features/student/pages/academic/StudentAcademicResultsPage";
import ProtectedRoute from "./router/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import TrainingScoreManagePage from "./features/advisor/pages/TrainingScoreManagePage";
import ClassCommitteeTrainingScoreManagePage from "./features/classcommittee/pages/TrainingScoreManagePage";
import AnnouncementListPage from "./features/user/pages/AnnouncementListPage";
import AnnouncementDetailPage from "./features/user/pages/AnnouncementDetailPage";
import ForgotPasswordPage from "./features/user/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/user/pages/ResetPasswordPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<AnnouncementListPage />} />
          <Route
            path="/profile"
            element={<ProtectedRoute allowedRoles={["STUDENT", "CLASS_COMMITTEE", "ACADEMIC_ADVISOR", "EMPLOYEE_FACULTY", "EMPLOYEE_DEPARTMENT"]} />}
          >
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  allowedRoles={["STUDENT", "CLASS_COMMITTEE"]}
                  fallback={
                    <ProtectedRoute
                      allowedRoles={["ACADEMIC_ADVISOR"]}
                      fallback={
                        <ProtectedRoute
                          allowedRoles={["EMPLOYEE_FACULTY"]}
                          fallback={<DepartmentProfilePage />}
                        >
                          <FacultyProfilePage />
                        </ProtectedRoute>
                      }
                    >
                      <AdvisorProfilePage />
                    </ProtectedRoute>
                  }
                >
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/user"
            element={<ProtectedRoute allowedRoles={["EMPLOYEE_FACULTY", "EMPLOYEE_DEPARTMENT"]} />}
          >
            <Route path="/user" element={<UserInfoPanel />} />
          </Route>
          <Route
            path="/scores"
            element={<ProtectedRoute allowedRoles={["STUDENT", "CLASS_COMMITTEE", "ACADEMIC_ADVISOR", "EMPLOYEE_FACULTY", "EMPLOYEE_DEPARTMENT"]} />}
          >
            <Route path="/scores" element={<ScorePage />} />
            <Route path="/scores/:id" element={<ScoreDetailPage />} />
          </Route>
          <Route
            path="/academic-results"
            element={<ProtectedRoute allowedRoles={["STUDENT", "CLASS_COMMITTEE"]} />}
          >
            <Route path="/academic-results" element={<StudentAcademicResultsPage />} />
          </Route>
          <Route
            path="/advisor/training-scores"
            element={
              <ProtectedRoute allowedRoles={["ACADEMIC_ADVISOR"]}>
                <TrainingScoreManagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/class-committee/training-scores"
            element={
              <ProtectedRoute allowedRoles={["CLASS_COMMITTEE"]}>
                <ClassCommitteeTrainingScoreManagePage />
              </ProtectedRoute>
            }
          />
          <Route path="/announcements" element={<AnnouncementListPage />} />
          <Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
        </Route>
        {/* Routes without MainLayout, like auth pages */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;