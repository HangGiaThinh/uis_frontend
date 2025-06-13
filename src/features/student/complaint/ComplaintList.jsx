import { useQuery } from '@tanstack/react-query'
import { getComplaints } from '../../../services/complaintApi'

function ComplaintList() {
    const { data: complaints, isLoading, error } = useQuery({
        queryKey: ['complaints'],
        queryFn: getComplaints,
    })

    if (isLoading) return <div className="text-center">Đang tải...</div>
    if (error) return <div className="text-error">Lỗi: {error.message}</div>

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Quản lý Khiếu nại</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Mã Khiếu Nại</th>
                            <th>Nội Dung</th>
                            <th>Ngày Gửi</th>
                            <th>Trạng Thái</th>
                            <th>Mã SV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((complaint) => (
                            <tr key={complaint.IdKhieuNai}>
                                <td>{complaint.IdKhieuNai}</td>
                                <td>{complaint.NoiDung}</td>
                                <td>{new Date(complaint.NgayGui).toLocaleDateString('vi-VN')}</td>
                                <td>{complaint.TrangThai}</td>
                                <td>{complaint.MaSV}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ComplaintList