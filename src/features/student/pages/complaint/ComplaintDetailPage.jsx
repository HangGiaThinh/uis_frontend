import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaint } from '../../services/complaint/complaintService';
import { SkeletonCard } from '../../../../components/common/Skeleton';
import { COMPLAINT_STATUS_LABELS, COMPLAINT_STATUS_COLORS, ROUTES } from '../../../../constants';

const ComplaintDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: complaint, isLoading, error } = useComplaint(id);

    if (isLoading) {
        return <SkeletonCard />;
    }

    if (error) {
        return (
            <div className="text-center text-red-600">
                Có lỗi xảy ra khi tải thông tin khiếu nại
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">{complaint.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${COMPLAINT_STATUS_COLORS[complaint.status]}`}>
                            {COMPLAINT_STATUS_LABELS[complaint.status]}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Nội dung khiếu nại</h2>
                            <p className="text-gray-600 whitespace-pre-wrap">{complaint.content}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Thông tin bổ sung</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Ngày gửi</p>
                                    <p className="text-gray-700">
                                        {new Date(complaint.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                {complaint.updatedAt && (
                                    <div>
                                        <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                                        <p className="text-gray-700">
                                            {new Date(complaint.updatedAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {complaint.response && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">Phản hồi</h2>
                                <p className="text-gray-600 whitespace-pre-wrap">{complaint.response}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => navigate(ROUTES.COMPLAINTS.LIST)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailPage; 