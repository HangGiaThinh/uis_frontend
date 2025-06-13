import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { fetchUserAcademicResults } from "../../services/academic/academicApi";
import StudentGPAChart from "../../components/academic/StudentGPAChart";

function StudentGPAChartPage() {
    const { isAuthenticated, user } = useAuth();
    const [gpaData, setGpaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAcademicResults = async () => {
            if (!isAuthenticated || !user) {
                setError("Vui lòng đăng nhập để xem kết quả học tập.");
                setLoading(false);
                return;
            }

            try {
                const data = await fetchUserAcademicResults();
                console.log("✅ Academic results data:", data);
                setGpaData(data);
            } catch (err) {
                console.error("❌ Lỗi khi gọi API:", err);
                const message = err.response?.data?.message || err.message || "Lỗi kết nối đến máy chủ.";
                setError(`Lỗi khi tải kết quả học tập: ${message} (Status: ${err.response?.status || 'N/A'})`);
            } finally {
                setLoading(false);
            }
        };

        fetchAcademicResults();
    }, [isAuthenticated, user]);

    return (
        <StudentGPAChart gpaData={gpaData} loading={loading} error={error} />
    );
}

export default StudentGPAChartPage;