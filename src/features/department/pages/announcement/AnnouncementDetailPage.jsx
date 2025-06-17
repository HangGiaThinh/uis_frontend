import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import announcementApi from "../../services/announcement/announcementApi";

function AnnouncementDetailPage() {
    const { id } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncementDetail = async () => {
            try {
                setLoading(true);
                const data = await announcementApi.getAnnouncementDetail(id);
                setAnnouncement(data);
                setError(null);
            } catch (err) {
                setError(err);
                console.error(`Lỗi khi tải chi tiết thông báo ${id}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncementDetail();
    }, [id]);

    if (loading) {
        return <div>Đang tải chi tiết thông báo...</div>;
    }

    if (error) {
        return <div className="text-red-500">Có lỗi xảy ra khi tải chi tiết thông báo. Vui lòng thử lại sau.</div>;
    }

    if (!announcement) {
        return <div>Không tìm thấy thông báo.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chi tiết Thông báo #{announcement.announcement_id}</h1>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <span className="font-semibold">Tiêu đề:</span> {announcement.title}
                </div>
                <div>
                    <span className="font-semibold">Nội dung:</span> {announcement.content}
                </div>
                {announcement.attachment_url && (
                    <div>
                        <span className="font-semibold">Đính kèm:</span> <a href={announcement.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Xem đính kèm</a>
                    </div>
                )}
                <div>
                    <span className="font-semibold">Ngày gửi:</span> {new Date(announcement.send_date).toLocaleString()}
                </div>
            </div>
        </div>
    );
}

export default AnnouncementDetailPage; 