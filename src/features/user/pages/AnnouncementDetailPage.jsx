import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Eye, Clock, Tag } from "lucide-react";
import api from "../../../services/api";

function AnnouncementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/v1/home/announcements/${id}`)
      .then((res) => {
        setData(res.data.data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        console.error("Lỗi khi tải thông báo:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#40ACE9] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-12xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-red-600 mb-6">
              Không thể tải thông báo. Vui lòng thử lại sau.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 bg-[#40ACE9] text-white rounded-lg hover:bg-[#369BD8] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-12xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.186-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
              Không tìm thấy thông báo
            </h3>
            <p className="text-yellow-600 mb-6">
              Thông báo bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 bg-[#40ACE9] text-white rounded-lg hover:bg-[#369BD8] transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-12xl mx-auto">
        {/* Header với breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center hover:text-[#369BD8] font-medium transition-colors duration-200 mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>

          {/* Badge và metadata */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#40ACE9] text-white">
              <Tag className="w-4 h-4 mr-1" />
              Thông báo chính thức
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(data.sendDate).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(data.sendDate).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header section */}
          <div className="px-2 py-2">
            <h1 className="text-2xl font-bold mb-4 leading-tight">
              {data.title}
            </h1>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-200 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500 font-bold">
                Phòng Công tác Sinh viên - Học viện Công nghệ Bưu chính Viễn
                thông
              </span>
            </div>
          </div>

          {/* Content section */}
          <div className="px-8 py-8">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.content }}
                style={{
                  lineHeight: "1.8",
                  fontSize: "16px",
                }}
              />
            </div>

            {data.attachmentUrl && (
              <div className="mt-8 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="w-5 h-5 text-[#40ACE9] mr-2" />
                    Tài liệu đính kèm
                  </h3>
                  <a
                    href={data.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Xem tài liệu
                  </a>
                </div>
              </div>
            )}

            {/* Footer info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium">Lưu ý:</span> Nếu bạn có thắc
                  mắc về nội dung thông báo này, vui lòng liên hệ trực tiếp với
                  Phòng Công tác Sinh viên để được hỗ trợ chi tiết.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetailPage;
