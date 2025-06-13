// src/features/student/components/StudentProfileLoader.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import api from "../../../../services/api";

function StudentProfileLoader({ children }) {
    const { isAuthenticated, user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isAuthenticated || !user) {
                setError("Vui lòng đăng nhập để xem thông tin.");
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/api/v1/student/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("API Response:", response.data); // Thêm log để debug
                if (response.data.status_code === 200) {
                    setProfile(response.data.data);
                } else {
                    setError("Không thể tải thông tin sinh viên.");
                }
            } catch (err) {
                console.error("API Error:", err.response?.data || err.message); // Log chi tiết lỗi
                setError("Lỗi khi tải thông tin: " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, user]);

    if (loading) return <div className="text-center p-4">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return children({ profile });
}

export default StudentProfileLoader;