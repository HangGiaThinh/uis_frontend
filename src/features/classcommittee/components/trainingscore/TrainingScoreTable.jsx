import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import trainingScoreApi from '../../services/trainingscore/trainingScoreApi';
import StatisticsModal from './StatisticsModal';

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

function TrainingScoreTable() {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classInfo, setClassInfo] = useState(null);
  const [showClassInfo, setShowClassInfo] = useState(false);
  const [statisticsModal, setStatisticsModal] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trainingScoreApi.getSemesters().then(res => {
      setSemesters(res.data.data || []);
    });
    trainingScoreApi.getClassName().then(res => {
      setClassInfo(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      setLoading(true);
      trainingScoreApi
        .getTrainingScores(selectedSemester)
        .then(res => {
          setScores(res.data.data || []);
        })
        .finally(() => setLoading(false));
    } else {
      setScores([]);
    }
  }, [selectedSemester]);

  const handleViewStatistics = async () => {
    if (selectedSemester) {
      setStatisticsLoading(true);
      setStatisticsModal(true);
      try {
        const res = await trainingScoreApi.getStatistics(selectedSemester);
        setStatistics(res.data.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setStatistics(null);
      } finally {
        setStatisticsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#40ACE9]">
      <div className="flex items-center mb-4 gap-4">
        {classInfo && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#40ACE9]">Lớp:</span>
            <button
              className="px-3 py-1 rounded bg-[#40ACE9] text-white font-semibold hover:bg-[#2696c8] transition"
              onClick={() => setShowClassInfo(v => !v)}
            >
              {classInfo.class_id}
            </button>
            {showClassInfo && (
              <div className="absolute z-10 mt-2 bg-white border border-[#40ACE9] rounded shadow p-4 min-w-[250px]">
                <div className="mb-2 font-bold text-[#40ACE9]">Thông tin lớp</div>
                <div><b>Mã lớp:</b> {classInfo.class_id}</div>
                <div><b>Chuyên ngành:</b> {classInfo.major}</div>
                <div><b>Hệ đào tạo:</b> {classInfo.education_level}</div>
                <div><b>Niên khóa:</b> {classInfo.academic_year}</div>
                <div><b>Sĩ số:</b> {classInfo.quantity_student}</div>
                <button className="mt-2 px-2 py-1 rounded bg-[#40ACE9] text-white" onClick={() => setShowClassInfo(false)}>Đóng</button>
              </div>
            )}
          </div>
        )}
        <label className="font-semibold ml-8">Chọn học kỳ:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedSemester}
          onChange={e => setSelectedSemester(e.target.value)}
        >
          <option value="">-- Chọn học kỳ --</option>
          {semesters.map(s => (
            <option key={s.id} value={s.id}>
              {`HK ${s.order} năm ${s.academicYear}`}
            </option>
          ))}
        </select>
        {selectedSemester && (
          <button
            onClick={handleViewStatistics}
            className="ml-auto px-4 py-2 bg-[#40ACE9] text-white rounded hover:bg-[#2696c8] transition font-semibold"
          >
            📊 Xem thống kê
          </button>
        )}
      </div>
      {selectedSemester && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border text-center rounded-lg overflow-hidden">
            <thead className="bg-[#40ACE9] text-white">
              <tr>
                <th className="border px-2 py-1">STT</th>
                <th className="border px-2 py-1">Mã SV</th>
                <th className="border px-2 py-1">Họ tên</th>
                <th className="border px-2 py-1">Tổng điểm</th>
                <th className="border px-2 py-1">Xếp loại</th>
                <th className="border px-2 py-1">Trạng thái</th>
                <th className="border px-2 py-1">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-4">Đang tải...</td>
                </tr>
              ) : scores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4">Không có dữ liệu</td>
                </tr>
              ) : (
                scores.map((item, idx) => (
                  <tr key={item.training_score_id}>
                    <td className="border px-2 py-1">{idx + 1}</td>
                    <td className="border px-2 py-1">{item.student_id}</td>
                    <td className="border px-2 py-1">{item.student_last_name} {item.student_first_name}</td>
                    <td className="border px-2 py-1">{item.total_score}</td>
                    <td className="border px-2 py-1">
                      <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${CLASSIFY_MAP[item.classification]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                        {CLASSIFY_MAP[item.classification]?.label || item.classification}
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_MAP[item.status]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                        {STATUS_MAP[item.status]?.label || item.status}
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <button 
                        className="text-blue-600 underline hover:text-blue-800"
                        onClick={() => navigate(`/class-committee/training-scores/${item.training_score_id}`)}
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
      )}
      
      <StatisticsModal
        isOpen={statisticsModal}
        onClose={() => setStatisticsModal(false)}
        statistics={statistics}
        loading={statisticsLoading}
      />
    </div>
  );
}

export default TrainingScoreTable; 