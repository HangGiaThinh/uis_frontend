import React, { useEffect, useState } from "react";
import announcementApi from "../../services/announcement/announcementApi";
import { PlusCircle, Trash2 } from "lucide-react";
import CreateAnnouncementForm from "../../components/announcement/CreateAnnouncementForm";

function AnnouncementManagementPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await announcementApi.getAnnouncements();
            setAnnouncements(response.data); // Access the 'data' array from the response
            setError(null);
        } catch (err) {
            setError(err);
            console.error("Lỗi khi tải danh sách thông báo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleCreateNew = () => {
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này không?")) {
            try {
                await announcementApi.deleteAnnouncement(id);
                fetchAnnouncements(); // Refresh the list after deletion
                alert("Xóa thông báo thành công!");
            } catch (err) {
                console.error("Lỗi khi xóa thông báo:", err);
                alert("Xóa thông báo thất bại.");
            }
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        fetchAnnouncements(); // Refresh the list after form submission
    };

    if (loading) {
        return <div>Đang tải danh sách thông báo...</div>;
    }

    if (error) {
        return <div className="text-red-500">Có lỗi xảy ra khi tải danh sách thông báo. Vui lòng thử lại sau.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý Thông báo</h1>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group"
                >
                    <PlusCircle className="w-4 h-4 group-hover:text-white" />
                    <span>Thêm thông báo mới</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {announcements.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#40ACE9] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tiêu đề</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nội dung</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày gửi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {announcements.map(announcement => (
                                    <tr key={announcement.announcement_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{announcement.announcement_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{announcement.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{announcement.content}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(announcement.send_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(announcement.announcement_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-5 h-5 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Không có thông báo nào để hiển thị.</p>
                )}
            </div>

            {isFormOpen && (
                <CreateAnnouncementForm
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}

export default AnnouncementManagementPage; 