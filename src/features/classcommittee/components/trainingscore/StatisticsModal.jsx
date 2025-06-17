import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CLASSIFICATION_COLORS = {
  excellent: '#2563eb', // Blue
  good: '#16a34a',      // Green  
  fair: '#ca8a04',      // Yellow
  average: '#ea580c',   // Orange
  weak: '#dc2626',      // Red
  poor: '#7c2d12'       // Dark red
};

const CLASSIFICATION_LABELS = {
  excellent: 'Xuất sắc',
  good: 'Giỏi',
  fair: 'Khá', 
  average: 'Trung bình',
  weak: 'Yếu',
  poor: 'Kém'
};

function StatisticsModal({ isOpen, onClose, statistics, loading }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const chartData = statistics ? {
    labels: [
      CLASSIFICATION_LABELS.excellent,
      CLASSIFICATION_LABELS.good,
      CLASSIFICATION_LABELS.fair,
      CLASSIFICATION_LABELS.average,
      CLASSIFICATION_LABELS.weak,
      CLASSIFICATION_LABELS.poor
    ],
    datasets: [{
      data: [
        statistics.total_excellent,
        statistics.total_good,
        statistics.total_fair,
        statistics.total_average,
        statistics.total_weak,
        statistics.total_poor
      ],
      backgroundColor: [
        CLASSIFICATION_COLORS.excellent,
        CLASSIFICATION_COLORS.good,
        CLASSIFICATION_COLORS.fair,
        CLASSIFICATION_COLORS.average,
        CLASSIFICATION_COLORS.weak,
        CLASSIFICATION_COLORS.poor
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} sinh viên (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#40ACE9]">
            Thống kê điểm rèn luyện
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Đang tải...</div>
          </div>
        ) : statistics ? (
          <div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                Lớp {statistics.class_id} - HK {statistics.semester_order} năm {statistics.semester_year}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Tổng số sinh viên:</strong> {statistics.total_student}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-blue-600">
                    <strong>Xuất sắc:</strong> {statistics.total_excellent}
                  </div>
                  <div className="text-green-600">
                    <strong>Giỏi:</strong> {statistics.total_good}
                  </div>
                  <div className="text-yellow-600">
                    <strong>Khá:</strong> {statistics.total_fair}
                  </div>
                  <div className="text-orange-600">
                    <strong>Trung bình:</strong> {statistics.total_average}
                  </div>
                  <div className="text-red-500">
                    <strong>Yếu:</strong> {statistics.total_weak}
                  </div>
                  <div className="text-red-700">
                    <strong>Kém:</strong> {statistics.total_poor}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-96 mb-4">
              {chartData && <Doughnut data={chartData} options={chartOptions} />}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 h-64 flex items-center justify-center">
            Không có dữ liệu thống kê
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#40ACE9] text-white rounded hover:bg-[#2696c8] transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatisticsModal; 