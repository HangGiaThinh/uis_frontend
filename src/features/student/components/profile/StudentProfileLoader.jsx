import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { fetchUserProfile } from "../../../auth/services/authApi";

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
                const data = await fetchUserProfile();
                console.log("✅ Profile response:", data);
                setProfile(data);
            } catch (err) {
                console.error("❌ Lỗi khi gọi API:", err);
                const message = err.response?.data?.message || err.message || "Lỗi kết nối đến máy chủ.";
                setError(`Lỗi khi tải thông tin: ${message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, user]);

    if (loading) return <div className="text-center p-4">Đang tải thông tin sinh viên...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return children({ profile });
}

export default StudentProfileLoader;