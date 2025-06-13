import { useQuery } from '@tanstack/react-query'
import { getScoreHistory } from '../../../services/scoreApi'

function ScoreHistory() {
  const { data: scores, isLoading, error } = useQuery({
    queryKey: ['scoreHistory'],
    queryFn: getScoreHistory,
  })

  if (isLoading) return <div className="text-center">Đang tải...</div>
  if (error) return <div className="text-error">Lỗi: {error.message}</div>

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Lịch sử Điểm rèn luyện</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Học kỳ</th>
                  <th>Tổng điểm</th>
                  <th>Thời gian chấm</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score.IdDRL}>
                    <td>{score.IdHK}</td>
                    <td>{score.TongDiem}</td>
                    <td>
                      {new Date(score.ThoiGianBatDau).toLocaleDateString('vi-VN')} -{' '}
                      {new Date(score.ThoiGianKetThuc).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <div className="dropdown">
                        <label tabIndex={0} className="btn btn-sm btn-ghost">
                          Xem chi tiết
                        </label>
                        <div
                          tabIndex={0}
                          className="dropdown-content card card-compact w-96 p-2 shadow bg-base-100"
                        >
                          <div className="card-body">
                            <h3 className="card-title">Chi tiết điểm</h3>
                            <ul>
                              {score.ChiTiet.map((detail) => (
                                <li key={detail.IdND}>
                                  {detail.NoiDung}: SV: {detail.DiemSV}, BCS: {detail.DiemBCS}, CVHT:{' '}
                                  {detail.DiemCVHT}
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
      </div>
    </div>
  )
}

export default ScoreHistory