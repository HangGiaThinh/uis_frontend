import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getComplaints } from '../../services/complaint/complaintService';

function ComplaintPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['complaints'],
        queryFn: getComplaints,
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

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Danh sách khiếu nại</h1>
                <Link
                    to="/complaints/create"
                    className="btn bg-[#00AEEF] hover:bg-[#0095cc] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Tạo khiếu nại mới
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tiêu đề</th>
                            <th>Ngày gửi</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.data.map((complaint, index) => (
                            <tr key={complaint.complaint_id}>
                                <td>{index + 1}</td>
                                <td>{complaint.title}</td>
                                <td>{new Date(complaint.send_date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(complaint.status)}`}>
                                        {getStatusText(complaint.status)}
                                    </span>
                                </td>
                                <td>
                                    <Link
                                        to={`/complaints/${complaint.complaint_id}`}
                                        className="btn bg-[#00AEEF] hover:bg-[#0095cc] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link
                to="/"
                className="btn bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mt-4"
            >
                Quay lại Trang chủ
            </Link>
        </div>
    );
}

export default ComplaintPage; 