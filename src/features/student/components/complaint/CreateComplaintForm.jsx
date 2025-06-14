import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCreateComplaint } from '../../services/complaint/complaintService';
import { ROUTES } from '../../../../constants';

const CreateComplaintForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { mutate: createComplaint, isLoading } = useCreateComplaint();

    const onSubmit = (data) => {
        createComplaint(data, {
            onSuccess: () => {
                toast.success('Gửi khiếu nại thành công');
                navigate(ROUTES.COMPLAINTS.LIST);
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Gửi khiếu nại mới</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Nội dung
                        </label>
                        <textarea
                            id="content"
                            rows={6}
                            {...register('content', { required: 'Vui lòng nhập nội dung' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Đang gửi...' : 'Gửi khiếu nại'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.COMPLAINTS.LIST)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                            Quay lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateComplaintForm; 