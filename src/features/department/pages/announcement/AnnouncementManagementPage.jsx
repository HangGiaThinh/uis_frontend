import React, { useEffect, useState } from "react";
import announcementApi from "../../services/announcement/announcementApi";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import CreateAnnouncementForm from "../../components/announcement/CreateAnnouncementForm";
import EditAnnouncementForm from "../../components/announcement/EditAnnouncementForm";

function AnnouncementManagementPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await announcementApi.getAnnouncements();
            console.log("API Response:", response); // Debug log
            
            // Kiểm tra cấu trúc response và xử lý an toàn
            let announcementsData = [];
            
            if (response && response.data) {
                // Trường hợp API trả về { data: { data: [...] } }
                if (response.data.data && Array.isArray(response.data.data)) {
                    announcementsData = response.data.data;
                }
                // Trường hợp API trả về { data: [...] } trực tiếp
                else if (Array.isArray(response.data)) {
                    announcementsData = response.data;
                }
                // Trường hợp khác, fallback về array rỗng
                else {
                    console.warn("Unexpected API response structure:", response);
                    announcementsData = [];
                }
            }
            
            // Sắp xếp theo ngày tạo giảm dần (mới nhất trước)
            const sortedAnnouncements = announcementsData.sort((a, b) => {
                const dateA = new Date(a.sendDate || a.send_date || 0);
                const dateB = new Date(b.sendDate || b.send_date || 0);
                return dateB - dateA;
            });
            
            setAnnouncements(sortedAnnouncements);
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
        setIsCreateFormOpen(true);
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setIsEditFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này không?")) {
            try {
                await announcementApi.deleteAnnouncement(id);
                fetchAnnouncements();
                alert("Xóa thông báo thành công!");
            } catch (err) {
                console.error("Lỗi khi xóa thông báo:", err);
                alert("Xóa thông báo thất bại.");
            }
        }
    };

    const handleCreateFormClose = () => {
        setIsCreateFormOpen(false);
        fetchAnnouncements();
    };

    const handleEditFormClose = () => {
        setIsEditFormOpen(false);
        setEditingAnnouncement(null);
        fetchAnnouncements();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40ACE9]"></div>
                <span className="ml-3 text-lg text-gray-600">Đang tải danh sách thông báo...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 font-medium">Có lỗi xảy ra khi tải danh sách thông báo. Vui lòng thử lại sau.</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="px-8 py-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </span>
                                Quản lý Thông báo
                            </h1>
                            <p className="text-gray-600 mt-2">Quản lý tất cả thông báo của phòng CTSV</p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center justify-center px-4 py-2 border border-[#40ACE9] text-[#40ACE9] font-semibold rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            <span>Tạo thông báo mới</span>
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {announcements.length > 0 ? (
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-[#40ACE9]">
                                    <tr>
                                        <th className="border border-[#E0E7EF] px-6 py-4 text-left font-bold text-white uppercase tracking-wider">STT</th>
                                        <th className="border border-[#E0E7EF] px-6 py-4 text-left font-bold text-white uppercase tracking-wider">Tiêu đề</th>
                                        <th className="border border-[#E0E7EF] px-6 py-4 text-left font-bold text-white uppercase tracking-wider">Ngày tạo</th>
                                        <th className="border border-[#E0E7EF] px-6 py-4 text-center font-bold text-white uppercase tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {announcements.map((announcement, index) => (
                                        <tr key={announcement.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={announcement.title}>
                                                    {announcement.title}
                                                </div>
                                                {(announcement.attachmentUrl || announcement.attachment_url) && (
                                                    <div className="text-xs text-blue-600 flex items-center mt-1">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        Có đính kèm
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(announcement.sendDate || announcement.send_date).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    })}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(announcement.sendDate || announcement.send_date).toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(announcement)}
                                                        className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(announcement.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thông báo nào</h3>
                            <p className="text-gray-500 mb-6">Hãy tạo thông báo đầu tiên để bắt đầu</p>
                            <button
                                onClick={handleCreateNew}
                                className="inline-flex items-center px-4 py-2 border border-[#40ACE9] text-[#40ACE9] font-semibold rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors duration-200"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Tạo thông báo mới
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isCreateFormOpen && (
                <CreateAnnouncementForm onClose={handleCreateFormClose} />
            )}

            {isEditFormOpen && editingAnnouncement && (
                <EditAnnouncementForm 
                    announcement={editingAnnouncement}
                    onClose={handleEditFormClose} 
                />
            )}
        </div>
    );
}

export default AnnouncementManagementPage; 