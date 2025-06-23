import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrainingScores } from '../../services/score/scoreService';
import { FaListAlt } from 'react-icons/fa';

const STATUS_MAP = {
  WAIT_STUDENT: {
  label: 'Chờ sinh viên',
  color: 'bg-yellow-100 text-yellow-800 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse'},
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

    const scores = (data?.data || []).slice().sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-6">
                <FaListAlt className="text-2xl text-[#00AEEF] mr-2" />
                <h1 className="text-2xl text-[#00AEEF] font-bold">DANH SÁCH ĐIỂM RÈN LUYỆN</h1>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md-2xl">
                <table className="min-w-full border-separate border-spacing-0 text-center rounded-lg overflow-hidden">
                    <thead className="bg-[#00AEEF] text-white">
                        <tr>
                            <th className="border border-[#D1D7E0] px-4 py-3">STT</th>
                            <th className="border border-[#D1D7E0] px-4 py-3">Học kỳ</th>
                            <th className="border border-[#D1D7E0] px-4 py-3">Thời gian bắt đầu</th>
                            <th className="border border-[#D1D7E0] px-4 py-3">Thời gian kết thúc</th>
                            <th className="border border-[#D1D7E0] px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">Tổng điểm</th>
                            <th className="border border-[#D1D7E0] px-4 py-3">Xếp loại</th>
                            <th className="border border-[#D1D7E0] px-4 py-3">Trạng thái</th>
                            <th className="border border-[#D1D7E0] px-4 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-8 text-gray-500">Không có dữ liệu điểm rèn luyện</td>
                            </tr>
                        ) : (
                            scores.map((score, index) => (
                                <tr key={score.id} className="hover:bg-gray-50 border-b border-[#E0E7EF]">
                                    <td className="border border-[#E0E7EF] px-4 py-3">{index + 1}</td>
                                    <td className="border border-[#E0E7EF] px-10 py-3 font-medium text-left whitespace-nowrap overflow-hidden text-ellipsis">
                                        {`Học kỳ ${score.semester.order} năm học ${score.semester.academic_year}`}
                                    </td>
                                    <td className="border border-[#E0E7EF] px-4 py-3">
                                        {formatDateTime(score.start_date)}
                                    </td>
                                    <td className="border border-[#E0E7EF] px-4 py-3">
                                        {formatDateTime(score.end_date)}
                                    </td>
                                    <td className="border border-[#E0E7EF] px-4 py-3 font-semibold text-xl">
                                        {score.total_score || 0}
                                    </td>
                                    <td className="border border-[#E0E7EF] px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {score.classification ? (
                                            <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${CLASSIFY_MAP[score.classification]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                                {CLASSIFY_MAP[score.classification]?.label || score.classification}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Chưa xếp loại</span>
                                        )}
                                    </td>
                                    <td className="border border-[#E0E7EF] px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                                        <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_MAP[score.status]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                            {STATUS_MAP[score.status]?.label || score.status}
                                        </span>
                                    </td>
                                    <td className="border border-[#E0E7EF] px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                                        <button 
                                            className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group mt-4 md:mt-0"
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

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
