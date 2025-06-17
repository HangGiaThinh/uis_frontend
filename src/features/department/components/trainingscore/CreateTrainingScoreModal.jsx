import React, { useState, useEffect } from 'react';
import trainingScoreApi from '../../services/trainingscore/trainingScoreApi';

const CreateTrainingScoreModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('class'); // 'class' or 'all'
  const [loading, setLoading] = useState(false);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCurrentSemester();
      loadFaculties();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedFaculty) {
      loadClasses(selectedFaculty);
    } else {
      setClasses([]);
      setSelectedClass('');
    }
  }, [selectedFaculty]);

  const loadCurrentSemester = async () => {
    try {
      const res = await trainingScoreApi.getCurrentSemester();
      setCurrentSemester(res.data.data);
    } catch (error) {
      console.error('Error loading current semester:', error);
    }
  };

  const loadFaculties = async () => {
    try {
      const res = await trainingScoreApi.getFaculties();
      setFaculties(res.data.data || []);
    } catch (error) {
      console.error('Error loading faculties:', error);
    }
  };

  const loadClasses = async (facultyId) => {
    try {
      const res = await trainingScoreApi.getClasses(facultyId);
      setClasses(res.data.data || []);
      setSelectedClass('');
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDateTimeForAPI = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19);
  };

  const validateDates = () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc');
      return false;
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < now) {
      alert('Thời gian bắt đầu phải từ hiện tại trở đi');
      return false;
    }

    if (start >= end) {
      alert('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateDates()) return;

    if (activeTab === 'class' && !selectedClass) {
      alert('Vui lòng chọn lớp');
      return;
    }

    const confirmMessage = activeTab === 'class' 
      ? `Bạn có chắc chắn muốn tạo điểm rèn luyện cho lớp ${selectedClass} trong ${currentSemester ? `HK ${currentSemester.order} năm ${currentSemester.academicYear}` : 'học kỳ hiện tại'}?`
      : `Bạn có chắc chắn muốn tạo điểm rèn luyện cho tất cả sinh viên trong ${currentSemester ? `HK ${currentSemester.order} năm ${currentSemester.academicYear}` : 'học kỳ hiện tại'}?`;

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const data = {
        class_id: activeTab === 'class' ? selectedClass : null,
        semester_id: currentSemester?.id,
        start_date: formatDateTimeForAPI(startDate),
        end_date: formatDateTimeForAPI(endDate)
      };

      await trainingScoreApi.createTrainingScores(data);
      alert('Tạo điểm rèn luyện thành công!');
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error creating training scores:', error);
      alert('Có lỗi xảy ra khi tạo điểm rèn luyện. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveTab('class');
    setSelectedFaculty('');
    setSelectedClass('');
    setStartDate('');
    setEndDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#40ACE9]">Tạo điểm rèn luyện mới</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'class'
                ? 'border-[#40ACE9] text-[#40ACE9]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('class')}
          >
            Theo lớp
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-[#40ACE9] text-[#40ACE9]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả lớp
          </button>
        </div>

        {/* Current Semester Info */}
        {currentSemester && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Học kỳ hiện tại:</h3>
            <p className="text-[#40ACE9] font-semibold">
              HK {currentSemester.order} năm {currentSemester.academicYear}
            </p>
          </div>
        )}

        {/* Class Selection (only for class tab) */}
        {activeTab === 'class' && (
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn khoa
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40ACE9]"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn lớp
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40ACE9]"
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
          </div>
        )}

        {/* Date Time Selection */}
        <div className="mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian bắt đầu
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40ACE9]"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            {startDate && (
              <p className="text-sm text-gray-500 mt-1">
                Hiển thị: {formatDateTime(startDate)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian kết thúc
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#40ACE9]"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
            {endDate && (
              <p className="text-sm text-gray-500 mt-1">
                Hiển thị: {formatDateTime(endDate)}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 border border-[#40ACE9] rounded-md transition-colors ${
              loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#40ACE9] text-white hover:bg-[#359bd9]'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Đang tạo...
              </div>
            ) : (
              'Tạo điểm rèn luyện'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrainingScoreModal; 