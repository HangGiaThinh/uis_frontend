import { useQuery } from '@tanstack/react-query'
import { getScores } from '../../../services/scoreApi'

function ScoreList() {
    const { data: scores, isLoading, error } = useQuery({
        queryKey: ['scores'],
        queryFn: getScores,
    })

    if (isLoading) return <div className="text-center">Đang tải...</div>
    if (error) return <div className="text-error">Lỗi: {error.message}</div>

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Quản lý Điểm rèn luyện</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Mã SV</th>
                            <th>Học Kỳ</th>
                            <th>Tổng Điểm</th>
                            <th>Thời Gian Bắt Đầu</th>
                            <th>Thời Gian Kết Thúc</th>
                            <th>Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score) => (
                            <tr key={score.IdDRL}>
                                <td>{score.MaSV}</td>
                                <td>{score.IdHK}</td>
                                <td>{score.TongDiem}</td>
                                <td>{new Date(score.ThoiGianBatDau).toLocaleDateString('vi-VN')}</td>
                                <td>{new Date(score.ThoiGianKetThuc).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className="dropdown">
                                        <label tabIndex={0} className="btn btn-sm btn-ghost">Xem chi tiết</label>
                                        <div tabIndex={0} className="dropdown-content card card-compact w-64 p-2 shadow bg-base-100">
                                            <div className="card-body">
                                                <h3 className="card-title">Chi tiết điểm</h3>
                                                <ul>
                                                    {score.ChiTiet.map((detail) => (
                                                        <li key={detail.IdND}>
                                                            Mục {detail.IdND}: SV: {detail.DiemSV}, BCS: {detail.DiemBCS}, CVHT: {detail.DiemCVHT}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ScoreList