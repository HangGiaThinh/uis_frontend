import React, { useEffect, useState } from "react";
import profileApi from "../../services/profile/profileApi";

function DepartmentProfileLoader({ children, reload = 0 }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileApi.getProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error loading department profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reload]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại sau.
      </div>
    );
  }

  return children({ profile });
}

export default DepartmentProfileLoader; 