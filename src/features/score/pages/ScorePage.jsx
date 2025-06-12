import { useQuery } from '@tanstack/react-query';
import { getTrainingScores } from '../services/scoreService';
import { Link } from 'react-router-dom';

function ScorePage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['trainingScores'],
        queryFn: getTrainingScores,
    });

    if (isLoading) return <div className="container mx-auto p-4">Đang tải...</div>;
    if (error) return <div className="container mx-auto p-4">Lỗi: {error.message}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách Điểm rèn luyện</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên kỳ</th>
                            <th>Thời gian bắt đầu</th>
                            <th>Thời gian kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data.map((score, index) => (
                            <tr key={score.id}>
                                <td>{index + 1}</td>
                                <td>{`Học kỳ ${score.semester.order} năm học ${score.semester.academic_year}`}</td>
                                <td>{new Date(score.start_date).toLocaleDateString()}</td>
                                <td>{new Date(score.end_date).toLocaleDateString()}</td>
                                <td>{score.status}</td>
                                <td>
                                    <Link to={`/scores/${score.id}`} className="btn btn-sm btn-primary">
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link to="/" className="btn btn-secondary mt-4" onClick={() => console.log('Navigating to home')}>
                Quay lại Trang chủ
            </Link>
        </div>
    );
}

export default ScorePage;