import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBullhorn, FaChevronRight } from 'react-icons/fa';
import api from '../../../services/api';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function AnnouncementListPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    setLoading(true);
    api.get(`/v1/home/announcements?page=${page}&size=${pageSize}`)
      .then(res => {
        setAnnouncements(res.data.data.data || []);
        setTotalPages(res.data.data.meta.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="bg-white rounded-lg shadow-md p-12 max-w-5xl mx-auto mt-6">
      <div className="flex items-center gap-2 mb-16 -mt-14">
        <FaBullhorn className="text-2xl text-[#40ACE9]" />
        <h1 className="text-xl font-bold text-[#40ACE9]">THÔNG BÁO</h1>
      </div>
      <ul className="divide-y divide-gray-200">
        {loading ? (
          <li className="py-8 text-center text-gray-500">Đang tải...</li>
        ) : announcements.length === 0 ? (
          <li className="py-8 text-center text-gray-500">Không có thông báo nào.</li>
        ) : announcements.map(item => (
          <li key={item.id} className="flex items-center gap-3 py-4 hover:bg-blue-50 transition duration-150 ease-in-out">
            <span className="flex items-center text-[#40ACE9] flex-shrink-0">
                <FaChevronRight className="text-xs" />
                <FaChevronRight className="text-xs" />
            </span>
            <div className="flex-1 min-w-0 flex justify-between items-center">
              <Link to={`/announcements/${item.id}`} className="font-semibold text-gray-800 hover:text-[#40ACE9] hover:underline text-base truncate pr-2">
                {item.title}
              </Link>
              <span className="text-sm text-gray-500 flex-shrink-0 text-right min-w-[120px]">{formatDate(item.sendDate)}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center gap-2 mt-6">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border text-[#40ACE9] border-[#40ACE9] disabled:opacity-50">&lt;</button>
        <span className="px-2 py-1">Trang {page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border text-[#40ACE9] border-[#40ACE9] disabled:opacity-50">&gt;</button>
      </div>
    </div>
  );
}

export default AnnouncementListPage; 