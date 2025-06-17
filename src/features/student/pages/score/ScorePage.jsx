import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrainingScores } from '../../services/score/scoreService';

const STATUS_MAP = {
  WAIT_STUDENT: { label: 'Chờ sinh viên', color: 'bg-yellow-100 text-yellow-800 border-yellow-400' },
  WAIT_CLASS_COMMITTEE: { label: 'Chờ ban cán sự', color: 'bg-orange-100 text-orange-800 border-orange-400' },
  WAIT_ADVISOR: { label: 'Chờ CVHT', color: 'bg-blue-100 text-blue-800 border-blue-400' },
  WAIT_FACULTY: { label: 'Chờ khoa', color: 'bg-purple-100 text-purple-800 border-purple-400' },
  WAIT_DEPARTMENT: { label: 'Chờ phòng CTSV', color: 'bg-pink-100 text-pink-800 border-pink-400' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800 border-green-400' },
  EXPIRED: { label: 'Hết hạn', color: 'bg-red-100 text-red-800 border-red-400' },
};

const CLASSIFY_MAP = {
  EXCELLENT: { label: 'Xuất sắc', color: 'bg-blue-100 text-blue-800 border-blue-400' },
  GOOD: { label: 'Giỏi', color: 'bg-green-100 text-green-800 border-green-400' },
  FAIR: { label: 'Khá', color: 'bg-yellow-100 text-yellow-800 border-yellow-400' },
  AVERAGE: { label: 'Trung bình', color: 'bg-orange-100 text-orange-800 border-orange-400' },
  WEAK: { label: 'Yếu', color: 'bg-pink-100 text-pink-800 border-pink-400' },
  POOR: { label: 'Kém', color: 'bg-red-100 text-red-800 border-red-400' },
};

function ScorePage() {
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({
        queryKey: ['trainingScores'],
        queryFn: getTrainingScores,
    });

    if (isLoading) return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#00AEEF]">
            <div className="text-center py-8">Đang tải...</div>
        </div>
    );
    
    if (error) return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#00AEEF]">
            <div className="text-center py-8 text-red-600">Lỗi: {error.message}</div>
        </div>
    );

    const scores = data?.data || [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#00AEEF]">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold text-[#00AEEF]">Danh sách Điểm rèn luyện</h1>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full border text-center rounded-lg overflow-hidden">
                    <thead className="bg-[#00AEEF] text-white">
                        <tr>
                            <th className="border px-4 py-3">STT</th>
                            <th className="border px-4 py-3">Học kỳ</th>
                            <th className="border px-4 py-3">Thời gian bắt đầu</th>
                            <th className="border px-4 py-3">Thời gian kết thúc</th>
                            <th className="border px-4 py-3">Tổng điểm</th>
                            <th className="border px-4 py-3">Xếp loại</th>
                            <th className="border px-4 py-3">Trạng thái</th>
                            <th className="border px-4 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-8 text-gray-500">Không có dữ liệu điểm rèn luyện</td>
                            </tr>
                        ) : (
                            scores.map((score, index) => (
                                <tr key={score.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-3">{index + 1}</td>
                                    <td className="border px-4 py-3 font-medium">
                                        {`Học kỳ ${score.semester.order} năm học ${score.semester.academic_year}`}
                                    </td>
                                    <td className="border px-4 py-3">
                                        {new Date(score.start_date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="border px-4 py-3">
                                        {new Date(score.end_date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="border px-4 py-3 font-semibold">
                                        {score.total_score || 0}
                                    </td>
                                    <td className="border px-4 py-3">
                                        {score.classification ? (
                                            <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${CLASSIFY_MAP[score.classification]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                                {CLASSIFY_MAP[score.classification]?.label || score.classification}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Chưa xếp loại</span>
                                        )}
                                    </td>
                                    <td className="border px-4 py-3">
                                        <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_MAP[score.status]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                            {STATUS_MAP[score.status]?.label || score.status}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-3">
                                        <button 
                                            className="bg-[#00AEEF] hover:bg-[#0095cc] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                            onClick={() => navigate(`/scores/${score.id}`)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ScorePage;