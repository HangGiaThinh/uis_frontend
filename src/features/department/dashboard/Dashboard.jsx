import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../../../services/dashboardApi'

function Dashboard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: getDashboardStats,
    })

    if (isLoading) return <div className="text-center">Đang tải...</div>
    if (error) return <div className="text-error">Lỗi: {error.message}</div>

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Tổng số sinh viên</h2>
                        <p className="text-3xl">{data?.studentCount || 0}</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Điểm rèn luyện kỳ này</h2>
                        <p className="text-3xl">{data?.scoreAverage || 0}</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Khiếu nại chưa xử lý</h2>
                        <p className="text-3xl">{data?.pendingComplaints || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard