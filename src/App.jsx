import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/user/layout/MainLayout";
import HomePage from "./features/user/pages/HomePage";
import StudentProfilePage from "./features/student/pages/profile/StudentProfilePage";
import UserInfoPanel from "./features/user/UserInfoPanel";
import ScorePage from "./features/student/pages/score/ScorePage";
import ScoreDetailPage from "./features/student/pages/score/ScoreDetailPage";
import StudentAcademicResultsPage from "./features/student/pages/academic/StudentAcademicResultsPage";
import ProtectedRoute from "./router/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ChangePasswordPage from "./features/student/pages/profile/ChangePasswordPage";
import ComplaintPage from "./features/student/pages/complaint/ComplaintPage";
import ComplaintDetailPage from "./features/student/pages/complaint/ComplaintDetailPage";
import CreateComplaintForm from "./features/student/components/complaint/CreateComplaintForm";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={<ProtectedRoute allowedRoles={["STUDENT", "CLASS_COMMITTEE", "ACADEMIC_ADVISOR", "EMPLOYEE_FACULTY", "EMPLOYEE_DEPARTMENT"]} />}
          >
            <Route path="/profile" element={<StudentProfilePage />} />
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
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;