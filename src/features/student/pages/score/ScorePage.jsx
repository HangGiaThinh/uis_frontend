import { useQuery } from '@tanstack/react-query';
import { getTrainingScores } from '../../services/score/scoreService';
import { Link } from 'react-router-dom';
import { SkeletonTable } from '../../../../components/common/Skeleton';

function ScorePage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['trainingScores'],
        queryFn: getTrainingScores,
    });

    console.log('ScorePage - isLoading:', isLoading);
    console.log('ScorePage - error:', error);
    console.log('ScorePage - data:', data);

    if (isLoading) {
        return <SkeletonTable rows={5} columns={6} />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-red-600">
                <p>Lỗi khi tải danh sách điểm rèn luyện: {error.message}</p>
                <p>Vui lòng kiểm tra console để biết thêm chi tiết.</p>
            </div>
        );
    }

    // Kiểm tra nếu data.data là null/undefined hoặc không phải mảng
    if (!data || !Array.isArray(data)) {
        return (
            <div className="container mx-auto p-4 text-gray-600">
                <p>Không có dữ liệu điểm rèn luyện để hiển thị.</p>
                <p>Dữ liệu nhận được: {JSON.stringify(data)}</p>
            </div>
        );
    }

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
                        {data.map((score, index) => {
                            if (!score || score.id === undefined) {
                                console.warn('Skipping malformed score object:', score);
                                return null; // Bỏ qua đối tượng không hợp lệ hoặc thiếu id
                            }
                            const semesterOrder = score.semester?.order || 'N/A';
                            const academicYear = score.semester?.academic_year || 'N/A';
                            const startDate = score.start_date ? new Date(score.start_date).toLocaleDateString() : 'N/A';
                            const endDate = score.end_date ? new Date(score.end_date).toLocaleDateString() : 'N/A';

                            return (
                                <tr key={score.id}>
                                    <td>{index + 1}</td>
                                    <td>{`Học kỳ ${semesterOrder} năm học ${academicYear}`}</td>
                                    <td>{startDate}</td>
                                    <td>{endDate}</td>
                                    <td>{score.status || 'N/A'}</td>
                                    <td>
                                        <Link to={`/scores/${score.id}`} className="btn bg-[#00AEEF] hover:bg-[#0095cc] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Link to="/" className="btn bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mt-4">Quay lại Trang chủ</Link>
        </div>
    );
}

export default ScorePage;