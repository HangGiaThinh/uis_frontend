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
import AdvisorTrainingScoreDetailPage from "./features/advisor/pages/TrainingScoreDetailPage";
import ClassCommitteeTrainingScoreManagePage from "./features/classcommittee/pages/TrainingScoreManagePage";
import ClassCommitteeTrainingScoreDetailPage from "./features/classcommittee/pages/TrainingScoreDetailPage";
import FacultyTrainingScoreManagePage from "./features/faculty/pages/TrainingScoreManagePage";
import FacultyTrainingScoreDetailPage from "./features/faculty/pages/TrainingScoreDetailPage";
import DepartmentTrainingScoreManagePage from "./features/department/pages/TrainingScoreManagePage";
import DepartmentTrainingScoreDetailPage from "./features/department/pages/TrainingScoreDetailPage";
import AnnouncementListPage from "./features/user/pages/AnnouncementListPage";
import AnnouncementDetailPage from "./features/user/pages/AnnouncementDetailPage";
import ForgotPasswordPage from "./features/user/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/user/pages/ResetPasswordPage";

import ChangePasswordPage from "./features/student/pages/profile/ChangePasswordPage";
import ComplaintPage from "./features/student/pages/complaint/ComplaintPage";
import ComplaintDetailPage from "./features/student/pages/complaint/ComplaintDetailPage";
import CreateComplaintForm from "./features/student/components/complaint/CreateComplaintForm";
import AccountManagementPage from "./features/department/pages/account/AccountManagementPage";
import ComplaintManagementPage from "./features/department/pages/complaint/ComplaintManagementPage";
import DepartmentComplaintDetailPage from "./features/department/pages/complaint/ComplaintDetailPage";
import AnnouncementManagementPage from "./features/department/pages/announcement/AnnouncementManagementPage";
import DepartmentAnnouncementDetailPage from "./features/department/pages/announcement/AnnouncementDetailPage";

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
            path="/change-password"
            element={<ProtectedRoute allowedRoles={["STUDENT", "CLASS_COMMITTEE", "ACADEMIC_ADVISOR", "EMPLOYEE_FACULTY", "EMPLOYEE_DEPARTMENT"]} />}
          >
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>
          <Route
            path="/complaints"
            element={<ProtectedRoute allowedRoles={["STUDENT", "CLASS_COMMITTEE"]} />}
          >
            <Route path="/complaints" element={<ComplaintPage />} />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="/complaints/create" element={<CreateComplaintForm />} />
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
            path="/advisor/training-scores/:id"
            element={
              <ProtectedRoute allowedRoles={["ACADEMIC_ADVISOR"]}>
                <AdvisorTrainingScoreDetailPage />
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
          <Route
            path="/class-committee/training-scores/:id"
            element={
              <ProtectedRoute allowedRoles={["CLASS_COMMITTEE"]}>
                <ClassCommitteeTrainingScoreDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/training-scores"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_FACULTY"]}>
                <FacultyTrainingScoreManagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/training-scores/:id"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_FACULTY"]}>
                <FacultyTrainingScoreDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/training-scores"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_DEPARTMENT"]}>
                <DepartmentTrainingScoreManagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department/training-scores/:id"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_DEPARTMENT"]}>
                <DepartmentTrainingScoreDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/announcements" element={<AnnouncementListPage />} />
          <Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
          <Route
            path="/accounts/manage"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_DEPARTMENT"]}>
                <AccountManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints/respond"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_DEPARTMENT"]}>
                <ComplaintManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints/respond/:id"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_DEPARTMENT"]}>
                <DepartmentComplaintDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements/manage"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_DEPARTMENT"]}>
                <AnnouncementManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements/manage/:id"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE_DEPARTMENT"]}>
                <DepartmentAnnouncementDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Routes without MainLayout, like auth pages */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;