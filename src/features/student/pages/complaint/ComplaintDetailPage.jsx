import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getComplaintDetail } from '../../services/complaint/complaintService';

function ComplaintDetailPage() {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['complaintDetail', id],
        queryFn: () => getComplaintDetail(id),
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'PROCESSED':
                return 'Đã xử lý';
            default:
                return status;
        }
    };

    if (isLoading) return <div className="container mx-auto p-4">Đang tải...</div>;
    if (error) return <div className="container mx-auto p-4">Lỗi: {error.message}</div>;

    const complaint = data?.data;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chi tiết khiếu nại</h1>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Thông tin khiếu nại</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Mã khiếu nại:</span> {complaint.complaint_id}</p>
                            <p><span className="font-medium">Tiêu đề:</span> {complaint.title}</p>
                            <p><span className="font-medium">Nội dung:</span> {complaint.content}</p>
                            <p><span className="font-medium">Ngày gửi:</span> {new Date(complaint.send_date).toLocaleString()}</p>
                            <p>
                                <span className="font-medium">Trạng thái:</span>{' '}
                                <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(complaint.status)}`}>
                                    {getStatusText(complaint.status)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Thông tin người gửi</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Mã sinh viên:</span> {complaint.student_id}</p>
                            <p><span className="font-medium">Họ và tên:</span> {complaint.student_name}</p>
                        </div>

                        {complaint.employee_name && (
                            <>
                                <h2 className="text-lg font-semibold mt-4 mb-2">Thông tin người xử lý</h2>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Mã nhân viên:</span> {complaint.employee_id}</p>
                                    <p><span className="font-medium">Họ và tên:</span> {complaint.employee_name}</p>
                                </div>
                            </>
                        )}

                        {complaint.response && (
                            <>
                                <h2 className="text-lg font-semibold mt-4 mb-2">Phản hồi</h2>
                                <div className="space-y-2">
                                    <p>{complaint.response}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <Link
                    to="/complaints"
                    className="btn bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Quay lại
                </Link>
            </div>
        </div>
    );
}

export default ComplaintDetailPage; 