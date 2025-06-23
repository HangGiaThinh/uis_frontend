import React, { useEffect, useState } from "react";
import complaintApi from "../../services/complaint/complaintApi";
import { Eye, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

function ComplaintManagementPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintApi.getComplaints();
      console.log("API Response:", response); // Debug log

      // Kiểm tra cấu trúc response và xử lý an toàn
      let complaintsData = [];

      if (response && response.data) {
        // Trường hợp API trả về { data: [...] } trực tiếp
        if (Array.isArray(response.data)) {
          complaintsData = response.data;
        }
        // Trường hợp API trả về { data: { data: [...] } }
        else if (response.data.data && Array.isArray(response.data.data)) {
          complaintsData = response.data.data;
        }
        // Trường hợp khác, fallback về array rỗng
        else {
          console.warn("Unexpected API response structure:", response);
          complaintsData = [];
        }
      }

      // Sắp xếp theo ngày gửi giảm dần (mới nhất trước)
      const sortedComplaints = complaintsData.sort((a, b) => {
        const dateA = new Date(a.send_date || 0);
        const dateB = new Date(b.send_date || 0);
        return dateB - dateA;
      });

      setComplaints(sortedComplaints);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Lỗi khi tải danh sách khiếu nại:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.7)] animate-pulse">
            Cần xử lý
          </span>
        );
      case "processed":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Đã giải quyết
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
            Đã từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            {status || "Không xác định"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40ACE9]"></div>
        <span className="ml-3 text-lg text-gray-600">
          Đang tải danh sách khiếu nại...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-800 font-medium">
              Có lỗi xảy ra khi tải danh sách khiếu nại. Vui lòng thử lại sau.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </span>
                Quản lý Khiếu nại
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và xử lý tất cả khiếu nại từ sinh viên
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {complaints.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#40ACE9]">
                  <tr>
                    <th className="border border-[#E0E7EF] px-6 py-4 text-left font-bold text-white uppercase tracking-wider">
                      STT
                    </th>
                    <th className="border border-[#E0E7EF] px-6 py-4 text-left font-bold text-white uppercase tracking-wider">
                      Sinh viên
                    </th>
                    <th className="border border-[#E0E7EF] px-6 py-4 text-left font-bold text-white uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="border border-[#E0E7EF] px-6 py-4 text-left font-bold text-white uppercase tracking-wider">
                      Ngày gửi
                    </th>
                    <th className="border border-[#E0E7EF] px-6 py-4 text-left font-bold text-white uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="border border-[#E0E7EF] px-6 py-4 text-center font-bold text-white uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map((complaint, index) => (
                    <tr
                      key={complaint.complaint_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-semibold text-red-600">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {complaint.student_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {complaint.student_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-sm font-medium text-gray-900 max-w-xs truncate"
                          title={complaint.title}
                        >
                          {complaint.title}
                        </div>
                        {complaint.attachment_url && (
                          <div className="text-xs text-blue-600 flex items-center mt-1">
                            <FileText className="w-3 h-3 mr-1" />
                            Có đính kèm
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(complaint.send_date).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(complaint.send_date).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(complaint.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <Link
                            to={`/complaints/respond/${complaint.complaint_id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có khiếu nại nào
              </h3>
              <p className="text-gray-500">
                Hiện tại chưa có khiếu nại nào cần xử lý
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintManagementPage;
