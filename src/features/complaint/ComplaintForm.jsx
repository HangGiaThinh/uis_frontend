import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { submitComplaint } from '../../services/complaintApi'

function ComplaintForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const mutation = useMutation({
        mutationFn: submitComplaint,
        onSuccess: (data) => {
            alert(data.message)
            reset()
        },
        onError: (error) => {
            alert(`Gửi khiếu nại thất bại: ${error.message}`)
        },
    })

    const onSubmit = (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        mutation.mutate({
            ...data,
            MaSV: userInfo.MaSV,
            NgayGui: new Date().toISOString(),
            TrangThai: 'Chưa xử lý',
        })
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Gửi Ý kiến/Thắc mắc</h1>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Nội dung khiếu nại</span>
                            </label>
                            <textarea
                                className={`textarea textarea-bordered h-24 ${errors.NoiDung ? 'textarea-error' : ''}`}
                                placeholder="Nhập nội dung khiếu nại"
                                {...register('NoiDung', { required: 'Nội dung là bắt buộc' })}
                            />
                            {errors.NoiDung && (
                                <span className="text-error text-sm">{errors.NoiDung.message}</span>
                            )}
                        </div>
                        <div className="card-actions justify-end mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={mutation.isLoading}
                            >
                                {mutation.isLoading ? 'Đang gửi...' : 'Gửi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ComplaintForm