import React, { useEffect, useState } from "react";
import complaintApi from "../../services/complaint/complaintApi";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

function ComplaintManagementPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // You might need pagination states here later

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await complaintApi.getComplaints();
            setComplaints(response.data); // Access the 'data' array inside the response
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

    if (loading) {
        return <div>Đang tải danh sách khiếu nại...</div>;
    }

    if (error) {
        return <div className="text-red-500">Có lỗi xảy ra khi tải danh sách khiếu nại. Vui lòng thử lại sau.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý Khiếu nại</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {complaints.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#40ACE9] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID Khiếu nại</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mã Sinh viên</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tiêu đề</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày gửi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {complaints.map(complaint => (
                                    <tr key={complaint.complaint_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.complaint_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.student_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(complaint.send_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                            <Link
                                                to={`/complaints/respond/${complaint.complaint_id}`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <Eye className="w-5 h-5 inline" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Không có khiếu nại nào để hiển thị.</p>
                )}
            </div>
        </div>
    );
}

export default ComplaintManagementPage; 