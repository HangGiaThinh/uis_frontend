// src/features/student/pages/StudentAverageGPAPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { fetchAverageGPA } from "../../services/academic/academicApi";
import StudentAverageGPA from "../../components/academic/StudentAverageGPA";

function StudentAverageGPAPage() {
    const { isAuthenticated, user } = useAuth();
    const [averageGpa, setAverageGpa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAverageGPA = async () => {
            if (!isAuthenticated || !user) {
                setError("Vui lòng đăng nhập để xem GPA.");
                setLoading(false);
                return;
            }

            try {
                const gpa = await fetchAverageGPA();
                console.log("🎓 GPA trung bình:", gpa);
                setAverageGpa(gpa);
            } catch (err) {
                console.error("❌ Lỗi khi lấy GPA:", err);
                const message = err.response?.data?.message || err.message || "Lỗi kết nối.";
                setError(`Không thể tải GPA: ${message}`);
            } finally {
                setLoading(false);
            }
        };

        loadAverageGPA();
    }, [isAuthenticated, user]);

    return (
        <div className="container mx-auto p-4">
            <StudentAverageGPA gpa={averageGpa} loading={loading} error={error} />
        </div>
    );
}

export default StudentAverageGPAPage;
