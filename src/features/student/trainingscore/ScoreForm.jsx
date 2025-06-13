import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getScoreForm, submitScoreForm } from '../../../services/scoreApi'

function ScoreForm() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { data: scoreForm, isLoading, error } = useQuery({
        queryKey: ['scoreForm'],
        queryFn: getScoreForm,
    })

    const mutation = useMutation({
        mutationFn: submitScoreForm,
        onSuccess: (data) => {
            alert(data.message)
        },
        onError: (error) => {
            alert(`Chấm điểm thất bại: ${error.message}`)
        },
    })

    if (isLoading) return <div className="text-center">Đang tải...</div>
    if (error) return <div className="text-error">Lỗi: {error.message}</div>

    const onSubmit = (data) => {
        const chiTiet = scoreForm.ChiTiet.map((item) => ({
            IdND: item.IdND,
            DiemSV: parseInt(data[`diem_${item.IdND}`]) || 0,
        }))
        mutation.mutate({
            IdDRL: scoreForm.IdDRL,
            IdHK: scoreForm.IdHK,
            MaSV: scoreForm.MaSV,
            ChiTiet: chiTiet,
            NgaySVCham: new Date().toISOString(),
        })
    }

    const criteriaGroups = [
        { title: 'Tiêu chí 1: Ý thức tham gia học tập', items: [], max: 20 },
        { title: 'Tiêu chí 2: Ý thức chấp hành nội quy, quy chế', items: [], max: 25 },
        { title: 'Tiêu chí 3: Ý thức tham gia hoạt động chính trị, xã hội', items: [], max: 20 },
        { title: 'Tiêu chí 4: Ý thức công dân trong quan hệ cộng đồng', items: [], max: 25 },
        { title: 'Tiêu chí 5: Ý thức tham gia phụ trách lớp, đoàn thể', items: [], max: 10 },
    ]

    scoreForm.ChiTiet.forEach((item) => {
        const groupIndex = parseInt(item.TieuChi.split('.')[0]) - 1
        criteriaGroups[groupIndex].items.push(item)
    })

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Phiếu Đánh giá Kết quả Rèn luyện</h1>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {criteriaGroups.map((group, index) => (
                            <div key={index} className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">{group.title}</h2>
                                <p className="text-sm text-gray-500 mb-2">Điểm tối đa: {group.max}</p>
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th className="w-1/12">Mã</th>
                                            <th className="w-6/12">Nội dung</th>
                                            <th className="w-2/12">Điểm tối đa</th>
                                            <th className="w-3/12">Điểm tự chấm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.items.map((item) => (
                                            <tr key={item.IdND}>
                                                <td>{item.TieuChi}</td>
                                                <td>{item.NoiDung}</td>
                                                <td>{item.MaxDiem}</td>
                                                <td>
                                                    {item.TieuChi === '1.2' ? (
                                                        <select
                                                            className={`select select-bordered w-full ${errors[`diem_${item.IdND}`] ? 'select-error' : ''}`}
                                                            {...register(`diem_${item.IdND}`, {
                                                                required: 'Điểm là bắt buộc',
                                                                validate: (value) => parseInt(value) <= item.MaxDiem || `Điểm không vượt quá ${item.MaxDiem}`,
                                                            })}
                                                        >
                                                            <option value="">Chọn điểm</option>
                                                            <option value="10">Xuất sắc (10)</option>
                                                            <option value="8">Giỏi (8)</option>
                                                            <option value="6">Khá (6)</option>
                                                            <option value="4">Trung bình (4)</option>
                                                            <option value="0">Dưới trung bình (0)</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={item.MaxDiem}
                                                            className={`input input-bordered w-full ${errors[`diem_${item.IdND}`] ? 'input-error' : ''}`}
                                                            {...register(`diem_${item.IdND}`, {
                                                                required: 'Điểm là bắt buộc',
                                                                min: { value: 0, message: 'Điểm không âm' },
                                                                max: { value: item.MaxDiem, message: `Điểm không vượt quá ${item.MaxDiem}` },
                                                            })}
                                                        />
                                                    )}
                                                    {errors[`diem_${item.IdND}`] && (
                                                        <span className="text-error text-sm">{errors[`diem_${item.IdND}`].message}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                        <div className="card-actions justify-end mt-4">
                            <button type="submit" className="btn btn-primary" disabled={mutation.isLoading}>
                                {mutation.isLoading ? 'Đang gửi...' : 'Gửi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ScoreForm