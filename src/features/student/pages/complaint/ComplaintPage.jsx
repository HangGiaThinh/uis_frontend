import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useComplaints } from '../../services/complaint/complaintService';
import { SkeletonTable } from '../../../../components/common/Skeleton';
import { COMPLAINT_STATUS_LABELS, COMPLAINT_STATUS_COLORS, ROUTES } from '../../../../constants';

const ComplaintPage = () => {
  const { data: complaints, isLoading, error } = useComplaints();

  if (isLoading) {
    return <SkeletonTable rows={5} columns={4} />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Có lỗi xảy ra khi tải danh sách khiếu nại
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách khiếu nại</h1>
        <Link
          to={ROUTES.COMPLAINTS.CREATE}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Tạo khiếu nại mới
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints?.map((complaint) => (
              <tr key={complaint.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {complaint.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${COMPLAINT_STATUS_COLORS[complaint.status]}`}>
                    {COMPLAINT_STATUS_LABELS[complaint.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={ROUTES.COMPLAINTS.DETAIL(complaint.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintPage; 