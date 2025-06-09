import { useQuery } from '@tanstack/react-query'
import { getStudents } from '../../services/studentApi'

function StudentList() {
    const { data: students, isLoading, error } = useQuery({
        queryKey: ['students'],
        queryFn: getStudents,
    })

    if (isLoading) return <div className="text-center">Đang tải...</div>
    if (error) return <div className="text-error">Lỗi: {error.message}</div>

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Quản lý Sinh viên</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Mã SV</th>
                            <th>Họ và Tên</th>
                            <th>Ngày Sinh</th>
                            <th>Giới Tính</th>
                            <th>Số Điện Thoại</th>
                            <th>Email</th>
                            <th>Chuyên Ngành</th>
                            <th>Lớp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.MaSV}>
                                <td>{student.MaSV}</td>
                                <td>{`${student.Ho} ${student.Ten}`}</td>
                                <td>{new Date(student.NgaySinh).toLocaleDateString('vi-VN')}</td>
                                <td>{student.GioiTinh ? 'Nam' : 'Nữ'}</td>
                                <td>{student.SoDienThoai}</td>
                                <td>{student.EmailTruong}</td>
                                <td>{student.MaCN}</td>
                                <td>{student.MaLop}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentList