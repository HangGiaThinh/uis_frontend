import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import complaintApi from "../../services/complaint/complaintApi";
import { useForm } from "react-hook-form";

function ComplaintDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

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
            await complaintApi.postComplaintResponse(id, { response: data.response });
            alert("Phản hồi khiếu nại thành công!");
            navigate(-1); // Go back to the previous page
        } catch (err) {
            console.error("Lỗi khi gửi phản hồi:", err);
            alert("Gửi phản hồi thất bại.");
        }
    };

    if (loading) {
        return <div>Đang tải chi tiết khiếu nại...</div>;
    }

    if (error) {
        return <div className="text-red-500">Có lỗi xảy ra khi tải chi tiết khiếu nại. Vui lòng thử lại sau.</div>;
    }

    if (!complaint) {
        return <div>Không tìm thấy khiếu nại.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chi tiết Khiếu nại #{complaint.complaint_id}</h1>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <span className="font-semibold">Mã sinh viên:</span> {complaint.student_id}
                </div>
                <div>
                    <span className="font-semibold">Tên sinh viên:</span> {complaint.student_name}
                </div>
                <div>
                    <span className="font-semibold">Tiêu đề:</span> {complaint.title}
                </div>
                <div>
                    <span className="font-semibold">Nội dung:</span> {complaint.content}
                </div>
                {complaint.attachment_url && (
                    <div>
                        <span className="font-semibold">Đính kèm:</span> <a href={complaint.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Xem đính kèm</a>
                    </div>
                )}
                <div>
                    <span className="font-semibold">Ngày gửi:</span> {new Date(complaint.send_date).toLocaleString()}
                </div>
                <div>
                    <span className="font-semibold">Trạng thái:</span> {complaint.status}
                </div>
                {complaint.employee_id && (
                    <div>
                        <span className="font-semibold">Mã nhân viên xử lý:</span> {complaint.employee_id}
                    </div>
                )}
                {complaint.employee_name && (
                    <div>
                        <span className="font-semibold">Tên nhân viên xử lý:</span> {complaint.employee_name}
                    </div>
                )}

                <h2 className="text-xl font-bold mt-6 mb-3">Phản hồi của Phòng Ban</h2>
                <form onSubmit={handleSubmit(onSubmitResponse)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nội dung phản hồi</label>
                        <textarea
                            {...register("response", { required: "Vui lòng nhập nội dung phản hồi" })}
                            rows="5"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        ></textarea>
                        {errors.response && <p className="text-red-500 text-xs mt-1">{errors.response.message}</p>}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#40ACE9] text-white rounded-md hover:bg-blue-600"
                        >
                            Gửi Phản hồi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ComplaintDetailPage; 