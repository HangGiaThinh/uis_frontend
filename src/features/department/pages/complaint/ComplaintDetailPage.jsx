import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import complaintApi from "../../services/complaint/complaintApi";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Eye,
  AlertCircle,
  Clock,
  Tag,
  Send,
  MessageSquare,
} from "lucide-react";

function ComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        setLoading(true);
        const data = await complaintApi.getComplaintDetail(id);
        setComplaint(data);
        setError(null);
        // Set default value for response if it exists
        if (data.response) {
          reset({ response: data.response });
        }
      } catch (err) {
        setError(err);
        console.error(`Lỗi khi tải chi tiết khiếu nại ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetail();
  }, [id, reset]);

  const onSubmitResponse = async (data) => {
    try {
      setIsSubmitting(true);
      await complaintApi.postComplaintResponse(id, { response: data.response });
      alert("Phản hồi khiếu nại thành công!");
      navigate(-1);
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      alert("Gửi phản hồi thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
            Đã giải quyết
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
            Đã từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            {status || "Không xác định"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#40ACE9] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            Đang tải chi tiết khiếu nại...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
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
              Không thể tải chi tiết khiếu nại. Vui lòng thử lại sau.
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

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
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
              Không tìm thấy khiếu nại
            </h3>
            <p className="text-yellow-600 mb-6">
              Khiếu nại bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header với breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-[#40ACE9] hover:text-[#369BD8] font-medium transition-colors duration-200 mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>

          {/* Badge và metadata */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-600 text-white">
              <AlertCircle className="w-4 h-4 mr-1" />
              Khiếu nại
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(complaint.send_date).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(complaint.send_date).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {getStatusBadge(complaint.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header section */}
              <div className="px-4 py-3 ">
                <h1 className="text-2xl font-bold mb-2 leading-tight">
                  {complaint.title}
                </h1>
               
              </div>

              {/* Content section */}
              <div className="px-8 py-6">
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 text-red-600 mr-2" />
                    Nội dung khiếu nại
                  </h3>
                  <div
                    className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: complaint.content }}
                    style={{
                      lineHeight: "1.8",
                      fontSize: "16px",
                    }}
                  />
                </div>

                {/* Attachment section */}
                {complaint.attachment_url && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-2" />
                      Tài liệu đính kèm
                    </h4>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            Tài liệu khiếu nại
                          </p>
                          <p className="text-sm text-gray-500">
                            Nhấn để xem chi tiết
                          </p>
                        </div>
                      </div>
                      <a
                        href={complaint.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem tài liệu
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Response form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Send className="w-6 h-6 text-[#40ACE9] mr-3" />
                Phản hồi khiếu nại
              </h2>
              <form
                onSubmit={handleSubmit(onSubmitResponse)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Nội dung phản hồi
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    {...register("response", {
                      required: "Vui lòng nhập nội dung phản hồi",
                      minLength: {
                        value: 10,
                        message: "Phản hồi phải có ít nhất 10 ký tự",
                      },
                    })}
                    rows="6"
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-[#40ACE9] focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                    placeholder="Nhập nội dung phản hồi chi tiết cho sinh viên..."
                  />
                  {errors.response && (
                    <div className="flex items-center mt-2 text-red-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        {errors.response.message}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-[#40ACE9] text-[#40ACE9] font-semibold rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        <span>Gửi phản hồi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                Thông tin sinh viên
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Mã sinh viên
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {complaint.student_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tên sinh viên
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {complaint.student_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Ngày gửi
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {new Date(complaint.send_date).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(complaint.send_date).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {(complaint.employee_id || complaint.employee_name) && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 7h6M9 11h6"
                    />
                  </svg>
                  Nhân viên xử lý
                </h3>
                <div className="space-y-4">
                  {complaint.employee_id && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Tag className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Mã nhân viên
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {complaint.employee_id}
                        </p>
                      </div>
                    </div>
                  )}

                  {complaint.employee_name && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Tên nhân viên
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {complaint.employee_name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetailPage;
