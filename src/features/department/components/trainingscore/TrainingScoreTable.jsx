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
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statisticsModal, setStatisticsModal] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    trainingScoreApi.getFaculties().then(res => {
      setFaculties(res.data.data || []);
    });
  }, []);

  // Load classes when faculty is selected
  useEffect(() => {
    if (selectedFaculty) {
      trainingScoreApi.getClasses(selectedFaculty).then(res => {
        setClasses(res.data.data || []);
      });
      // Reset selected class and semester when faculty changes
      setSelectedClass('');
      setSelectedSemester('');
    } else {
      setClasses([]);
      setSelectedClass('');
      setSelectedSemester('');
    }
  }, [selectedFaculty]);

  // Load semesters when class is selected
  useEffect(() => {
    if (selectedClass) {
      trainingScoreApi.getSemesters(selectedClass).then(res => {
        setSemesters(res.data.data || []);
      });
      // Reset selected semester when class changes
      setSelectedSemester('');
    } else {
      setSemesters([]);
      setSelectedSemester('');
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedSemester && selectedClass) {
      setLoading(true);
      trainingScoreApi
        .getTrainingScores(selectedClass, selectedSemester)
        .then(res => {
          setScores(res.data.data || []);
        })
        .finally(() => setLoading(false));
    } else {
      setScores([]);
    }
  }, [selectedSemester, selectedClass]);

  const handleViewStatistics = async () => {
    if (selectedSemester && selectedClass) {
      setStatisticsLoading(true);
      setStatisticsModal(true);
      try {
        const res = await trainingScoreApi.getStatistics(selectedClass, selectedSemester);
        setStatistics(res.data.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setStatistics(null);
      } finally {
        setStatisticsLoading(false);
      }
    }
  };

  const getClassificationLabel = (totalScore) => {
    if (totalScore >= 90) return CLASSIFY_MAP.EXCELLENT;
    if (totalScore >= 80) return CLASSIFY_MAP.GOOD;
    if (totalScore >= 65) return CLASSIFY_MAP.FAIR;
    if (totalScore >= 50) return CLASSIFY_MAP.AVERAGE;
    if (totalScore >= 35) return CLASSIFY_MAP.WEAK;
    return CLASSIFY_MAP.POOR;
  };

  const handleApproveAll = async () => {
    const confirmResult = window.confirm(
      `Bạn có chắc chắn muốn duyệt tất cả điểm rèn luyện của lớp ${selectedClass} trong ${
        semesters.find(s => s.id.toString() === selectedSemester)?.order 
          ? `HK ${semesters.find(s => s.id.toString() === selectedSemester).order} năm ${semesters.find(s => s.id.toString() === selectedSemester).academicYear}` 
          : 'học kỳ này'
      }?`
    );
    
    if (!confirmResult) return;
    
    setApproving(true);
    
    try {
      await trainingScoreApi.approveAll(selectedClass, selectedSemester);
      alert('Duyệt tất cả điểm rèn luyện thành công!');
      // Refresh data
      if (selectedSemester && selectedClass) {
        const res = await trainingScoreApi.getTrainingScores(selectedClass, selectedSemester);
        setScores(res.data.data || []);
      }
    } catch (error) {
      console.error('Error approving all scores:', error);
      alert('Có lỗi xảy ra khi duyệt điểm rèn luyện. Vui lòng thử lại.');
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#40ACE9] w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-3 w-full max-w-md">
          <div className="flex items-center gap-4">
            <select
              className="border rounded px-2 py-1 w-full"
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value)}
            >
              <option value="">-- Chọn khoa --</option>
              {faculties.map(f => (
                <option key={f.departmentId} value={f.departmentId}>
                  {f.departmentName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <select
              className="border rounded px-2 py-1 w-full"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              disabled={!selectedFaculty}
            >
              <option value="">
                {!selectedFaculty ? "-- Vui lòng chọn khoa trước --" : "-- Chọn lớp --"}
              </option>
              {classes.map(c => (
                <option key={c.class_id} value={c.class_id}>
                  {c.class_id} - {c.major} ({c.education_level})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <select
              className="border rounded px-2 py-1 w-full"
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              disabled={!selectedClass}
            >
              <option value="">
                {!selectedClass ? "-- Vui lòng chọn lớp trước --" : "-- Chọn học kỳ --"}
              </option>
              {semesters.map(s => (
                <option key={s.id} value={s.id}>
                  {`HK ${s.order} năm ${s.academicYear}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedSemester && selectedClass && (
          <div className="flex gap-2">
            <button
              onClick={handleViewStatistics}
              disabled={scores.length === 0}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                scores.length === 0 
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed opacity-50' 
                  : 'border-[#40ACE9] text-[#40ACE9] hover:bg-[#40ACE9] hover:text-white'
              }`}
            >
              📊 Xem thống kê
            </button>
            <button
              onClick={handleApproveAll}
              disabled={scores.length === 0 || approving}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                scores.length === 0 || approving
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed opacity-50' 
                  : 'border-[#40ACE9] text-[#40ACE9] hover:bg-[#40ACE9] hover:text-white'
              }`}
            >
              {approving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Đang duyệt...
                </>
              ) : (
                <>
                  🚀 Duyệt tất cả
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {selectedSemester && selectedClass && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border text-center rounded-lg overflow-hidden">
            <thead className="bg-[#40ACE9] text-white">
              <tr>
                <th className="border px-2 py-2 text-xs" rowSpan={2}>TT</th>
                <th className="border px-2 py-2 text-xs" rowSpan={2}>Họ và tên</th>
                <th className="border px-2 py-2 text-xs" rowSpan={2}>Mã sinh viên</th>
                <th className="border px-2 py-2 text-xs" colSpan={5}>ĐIỂM TIÊU CHÍ</th>
                <th className="border px-2 py-2 text-xs" rowSpan={2}>Tổng điểm</th>
                <th className="border px-2 py-2 text-xs" rowSpan={2}>XẾP LOẠI</th>
                <th className="border px-2 py-2 text-xs" rowSpan={2}>TRẠNG THÁI</th>
                <th className="border px-2 py-2 text-xs" rowSpan={2}>HÀNH ĐỘNG</th>
              </tr>
              <tr>
                <th className="border px-1 py-2 text-xs">
                  I<br/>
                  <span className="text-xs">(Max=20)</span>
                </th>
                <th className="border px-1 py-2 text-xs">
                  II<br/>
                  <span className="text-xs">(Max=25)</span>
                </th>
                <th className="border px-1 py-2 text-xs">
                  III<br/>
                  <span className="text-xs">(Max=25)</span>
                </th>
                <th className="border px-1 py-2 text-xs">
                  IV<br/>
                  <span className="text-xs">(Max=25)</span>
                </th>
                <th className="border px-1 py-2 text-xs">
                  V<br/>
                  <span className="text-xs">(Max=10)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-4">Đang tải...</td>
                </tr>
              ) : scores.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-4">Không có dữ liệu</td>
                </tr>
              ) : (
                scores.map((item, idx) => {
                  const classificationInfo = getClassificationLabel(item.totalScore);
                  const statusInfo = STATUS_MAP[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-800 border-gray-300' };
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border px-2 py-2 text-sm">{idx + 1}</td>
                      <td className="border px-2 py-2 text-sm text-left">
                        {item.studentLastName} {item.studentFirstName}
                      </td>
                      <td className="border px-2 py-2 text-sm">{item.studentId}</td>
                      {item.departmentCriteriaResponses.map((criteria, criteriaIdx) => (
                        <td key={criteriaIdx} className="border px-2 py-2 text-sm">
                          {criteria.score}
                        </td>
                      ))}
                      <td className="border px-2 py-2 text-sm font-semibold">
                        {item.totalScore}
                      </td>
                      <td className="border px-2 py-2">
                        <span className={`inline-block px-2 py-1 rounded-full border text-xs font-semibold ${classificationInfo?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                          {classificationInfo?.label || 'Chưa xác định'}
                        </span>
                      </td>
                      <td className="border px-2 py-2">
                        <span className={`inline-block px-2 py-1 rounded-full border text-xs font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="border px-2 py-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                          onClick={() => navigate(`/department/training-scores/${item.id}`)}
                          title="Chỉnh sửa điểm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
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