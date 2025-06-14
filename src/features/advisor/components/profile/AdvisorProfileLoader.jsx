import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import profileApi from "../../services/profile/profileApi";

function AdvisorProfileLoader({ children, reload }) {
    const { isAuthenticated, user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;
        const fetchProfile = async () => {
            if (!isAuthenticated || !user) {
                setError("Vui lòng đăng nhập để xem thông tin.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await profileApi.getProfile();
                if (!ignore) setProfile(data);
            } catch (err) {
                if (!ignore) {
                    const message = err.response?.data?.message || err.message || "Lỗi kết nối đến máy chủ.";
                    setError(`Lỗi khi tải thông tin: ${message}`);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        fetchProfile();
        return () => { ignore = true; };
    }, [isAuthenticated, user, reload]);

    if (loading) return <div className="text-center p-4">Đang tải thông tin giảng viên...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return children({ profile });
}

export default AdvisorProfileLoader; 