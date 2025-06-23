import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getComplaints } from "../../services/complaint/complaintService";
import { FaListAlt, FaPlus } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";

function ComplaintPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["complaints"],
    queryFn: getComplaints,
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)] animate-pulse";
      case "PROCESSED":
        return "bg-green-100 text-green-800 border-green-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PROCESSING":
        return "Đang xử lý";
      case "PROCESSED":
        return "Đã xử lý";
      default:
        return status;
    }
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (isLoading)
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#40ACE9]">
        <div className="text-center py-8">Đang tải...</div>
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#40ACE9]">
        <div className="text-center py-8 text-red-600">
          Lỗi: {error.message}
        </div>
      </div>
    );

  // Sort complaints by send_date, newest first
  const complaints = (data?.data?.data || [])
    .slice()
    .sort((a, b) => new Date(b.send_date) - new Date(a.send_date));

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaListAlt className="text-2xl text-[#40ACE9] mr-2" />
          <h1 className="text-2xl font-bold text-[#40ACE9]">
            DANH SÁCH KHIẾU NẠI
          </h1>
        </div>
        <Link
          to="/complaints/create"
          className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group"
        >
          <FaPlus className="w-4 h-4" />
          Tạo khiếu nại mới
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border-separate border-spacing-0 text-center rounded-lg overflow-hidden">
          <thead className="bg-[#40ACE9] text-white">
            <tr>
              <th className="border border-[#D1D7E0] px-4 py-3">STT</th>
              <th className="border border-[#D1D7E0] px-4 py-3">Tiêu đề</th>
              <th className="border border-[#D1D7E0] px-4 py-3">Ngày gửi</th>
              <th className="border border-[#D1D7E0] px-4 py-3">Trạng thái</th>
              <th className="border border-[#D1D7E0] px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-gray-500">
                  Không có dữ liệu khiếu nại
                </td>
              </tr>
            ) : (
              complaints.map((complaint, index) => (
                <tr
                  key={complaint.complaint_id}
                  className="hover:bg-gray-50 border-b border-[#E0E7EF]"
                >
                  <td className="border border-[#E0E7EF] px-4 py-3">
                    {index + 1}
                  </td>
                  <td className="border border-[#E0E7EF] px-4 py-3 font-medium text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                    {complaint.title}
                  </td>
                  <td className="border border-[#E0E7EF] px-4 py-3">
                    {formatDateTime(complaint.send_date)}
                  </td>
                  <td className="border border-[#E0E7EF] px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                    <span
                      className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${getStatusBadgeClass(
                        complaint.status
                      )}`}
                    >
                      {getStatusText(complaint.status)}
                    </span>
                  </td>
                  <td className="border border-[#E0E7EF] px-4 py-3 text-center">
                    <Link
                      to={`/complaints/${complaint.complaint_id}`}
                      className="text-[#40ACE9] hover:text-white hover:bg-[#40ACE9] p-2 rounded-full transition-colors duration-200 inline-flex items-center justify-center"
                      title="Xem chi tiết"
                    >
                      <AiOutlineEye className="w-5 h-5" />
                    </Link>
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

export default ComplaintPage;
