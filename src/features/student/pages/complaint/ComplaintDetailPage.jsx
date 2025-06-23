import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getComplaintDetail } from '../../services/complaint/complaintService';
import RichTextViewer from '../../components/complaint/RichTextViewer';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaFileAlt, FaClock } from 'react-icons/fa';

function ComplaintDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({
        queryKey: ['complaintDetail', id],
        queryFn: () => getComplaintDetail(id),
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-400';
            case 'PROCESSED':
                return 'bg-green-100 text-green-800 border-green-400';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'PROCESSED':
                return 'Đã xử lý';
            default:
                return status;
        }
    };

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    if (isLoading) return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#40ACE9]">
            <div className="text-center py-8">Đang tải...</div>
        </div>
    );
    
    if (error) return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#40ACE9]">
            <div className="text-center py-8 text-red-600">Lỗi: {error.message}</div>
        </div>
    );

    const complaint = data?.data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <FaFileAlt className="text-2xl text-[#40ACE9]" />
                        <h1 className="text-2xl font-bold text-[#40ACE9]">CHI TIẾT KHIẾU NẠI</h1>
                    </div>
                    <button
                        onClick={() => navigate('/complaints')}
                        className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group"
                    >
                        <FaArrowLeft className="w-4 h-4 group-hover:text-white" />
                        Quay lại
                    </button>
                </div>

                <div className="border-t border-[#E0E7EF] pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Mã khiếu nại:</span>
                                <span className="text-[#40ACE9] font-semibold">{complaint.complaint_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Tiêu đề:</span>
                                <span className="font-medium">{complaint.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-[#40ACE9] w-4 h-4" />
                                <span className="font-semibold text-gray-700 min-w-[120px]">Ngày gửi:</span>
                                <span>{formatDateTime(complaint.send_date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-[#40ACE9] w-4 h-4" />
                                <span className="font-semibold text-gray-700 min-w-[120px]">Trạng thái:</span>
                                <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${getStatusBadgeClass(complaint.status)}`}>
                                    {getStatusText(complaint.status)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FaUser className="text-[#40ACE9] w-4 h-4" />
                                <span className="font-semibold text-gray-700 min-w-[120px]">Mã sinh viên:</span>
                                <span>{complaint.student_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Họ và tên:</span>
                                <span className="font-medium">{complaint.student_name}</span>
                            </div>
                            {complaint.employee_name && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-700 min-w-[120px]">Người xử lý:</span>
                                        <span>{complaint.employee_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-700 min-w-[120px]">Mã nhân viên:</span>
                                        <span>{complaint.employee_id}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-[#40ACE9] border-b border-[#40ACE9] mb-4 pb-2">
                    Nội dung khiếu nại
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-[#E0E7EF]">
                    <RichTextViewer content={complaint.content} />
                </div>
            </div>

            {/* Response Section */}
            {complaint.response && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-[#40ACE9] border-b border-[#40ACE9] mb-4 pb-2">
                        Phản hồi từ phòng ban
                    </h2>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <RichTextViewer content={complaint.response} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ComplaintDetailPage; 