import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createComplaint } from '../../services/complaint/complaintService';
import { useNavigate } from 'react-router-dom';

function CreateComplaintForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: createComplaint,
        onSuccess: () => {
            alert('Gửi khiếu nại thành công!');
            navigate('/complaints');
        },
        onError: (error) => alert('Lỗi khi gửi khiếu nại: ' + error.message),
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                <input
                    type="text"
                    {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.title && (
                    <span className="text-red-500 text-sm">{errors.title.message}</span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                <textarea
                    {...register('content', { required: 'Vui lòng nhập nội dung' })}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.content && (
                    <span className="text-red-500 text-sm">{errors.content.message}</span>
                )}
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => navigate('/complaints')}
                    className="btn bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="btn bg-[#00AEEF] hover:bg-[#0095cc] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    disabled={mutation.isLoading}
                >
                    {mutation.isLoading ? 'Đang gửi...' : 'Gửi khiếu nại'}
                </button>
            </div>
        </form>
    );
}

export default CreateComplaintForm; 