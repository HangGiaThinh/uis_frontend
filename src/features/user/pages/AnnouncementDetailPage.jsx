import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import api from '../../../services/api';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function AnnouncementDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/v1/home/announcements/${id}`)
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Đang tải...</div>;
  if (!data) return <div className="text-center py-12 text-gray-500">Không tìm thấy thông báo.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto mt-6">
      <Link to="/announcements" className="text-[#40ACE9] flex items-center gap-2 mb-4 -mt-12 hover:underline">
        <FaArrowLeft /> <span>Quay lại danh sách</span>
      </Link>
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <div className="text-sm text-gray-500 mb-4">{formatDate(data.sendDate)}</div>
      <div className="mb-6 text-base text-gray-800 whitespace-pre-line">{data.content}</div>
      {data.attachmentUrl && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <FaFileAlt className="text-2xl text-[#40ACE9]" />
          <a href={data.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-[#40ACE9] font-semibold hover:underline">Xem thêm</a>
        </div>
      )}
    </div>
  );
}

export default AnnouncementDetailPage; 