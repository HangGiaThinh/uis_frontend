import React, { useState } from "react";
import { User } from "lucide-react";
import AdvisorProfileLoader from "../../components/profile/AdvisorProfileLoader";
import { useForm } from "react-hook-form";
import profileApi from "../../services/profile/profileApi";

const ACADEMIC_RANKS = [
    { value: 'ThS', label: 'Thạc sĩ' },
    { value: 'TS', label: 'Tiến sĩ' },
    { value: 'PGS.TS', label: 'Phó Giáo sư, Tiến sĩ' },
    { value: 'GS.TS', label: 'Giáo sư, Tiến sĩ' },
];

const ACADEMIC_TITLES = [
    { value: 'GV', label: 'Giảng viên' },
    { value: 'GVC', label: 'Giảng viên chính' },
    { value: 'PGS', label: 'Phó Giáo sư' },
    { value: 'GS', label: 'Giáo sư' },
];

function AdvisorProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const handleEdit = () => {
        setIsEditing(true);
    };

    const onSubmit = async (data) => {
        try {
            await profileApi.updateProfile(data, avatar);
            setIsEditing(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Thông tin Giảng viên</h1>
            <AdvisorProfileLoader>
                {({ profile }) => (
                    profile ? (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            {isEditing ? (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-1/3">
                                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                                                <label className="cursor-pointer">
                                                    {profile.image_url ? (
                                                        <img
                                                            src={profile.image_url}
                                                            alt="Avatar"
                                                            className="w-32 h-32 object-cover mx-auto rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <User className="w-16 h-16 text-gray-400" />
                                                            <span className="mt-2">Tải ảnh lên</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleAvatarChange}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="w-2/3 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Họ</label>
                                                <input
                                                    type="text"
                                                    defaultValue={profile.last_name}
                                                    {...register('last_name', { required: 'Vui lòng nhập họ' })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                {errors.last_name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                                <input
                                                    type="text"
                                                    defaultValue={profile.first_name}
                                                    {...register('first_name', { required: 'Vui lòng nhập tên' })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                {errors.first_name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                            <div className="mt-1 space-x-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="true"
                                                        defaultChecked={profile.gender}
                                                        {...register('gender', { required: 'Vui lòng chọn giới tính' })}
                                                        className="form-radio"
                                                    />
                                                    <span className="ml-2">Nam</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        value="false"
                                                        defaultChecked={!profile.gender}
                                                        {...register('gender')}
                                                        className="form-radio"
                                                    />
                                                    <span className="ml-2">Nữ</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                defaultValue={profile.phone_number}
                                                {...register('phone_number', { required: 'Vui lòng nhập số điện thoại' })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                defaultValue={profile.email}
                                                {...register('email', {
                                                    required: 'Vui lòng nhập email',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Email không hợp lệ',
                                                    },
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">CCCD</label>
                                            <input
                                                type="text"
                                                defaultValue={profile.citizen_id}
                                                {...register('citizen_id', { required: 'Vui lòng nhập CCCD' })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Học hàm</label>
                                            <select
                                                defaultValue={profile.academic_rank}
                                                {...register('academic_rank', { required: 'Vui lòng chọn học hàm' })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">Chọn học hàm</option>
                                                {ACADEMIC_RANKS.map((rank) => (
                                                    <option key={rank.value} value={rank.value}>
                                                        {rank.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Học vị</label>
                                            <select
                                                defaultValue={profile.academic_title}
                                                {...register('academic_title')}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">Chọn học vị</option>
                                                {ACADEMIC_TITLES.map((title) => (
                                                    <option key={title.value} value={title.value}>
                                                        {title.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Chuyên ngành</label>
                                            <input
                                                type="text"
                                                defaultValue={profile.specialization}
                                                {...register('specialization', { required: 'Vui lòng nhập chuyên ngành' })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={handleEdit}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Cập nhật thông tin
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <p><strong>Mã giảng viên:</strong> {profile.lecturer_id}</p>
                                        <p><strong>Họ và tên:</strong> {profile.last_name} {profile.first_name}</p>
                                        <p><strong>Giới tính:</strong> {profile.gender ? "Nam" : "Nữ"}</p>
                                        <p><strong>Số điện thoại:</strong> {profile.phone_number}</p>
                                        <p><strong>CCCD:</strong> {profile.citizen_id}</p>
                                        <p><strong>Email:</strong> {profile.email}</p>
                                        <p><strong>Học hàm:</strong> {profile.academic_rank}</p>
                                        <p><strong>Học vị:</strong> {profile.academic_title || "Không có"}</p>
                                        <p><strong>Chuyên ngành:</strong> {profile.specialization}</p>
                                        <p><strong>Khoa:</strong> {profile.lecturer_department.department_name}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : <p>Không có dữ liệu để hiển thị.</p>
                )}
            </AdvisorProfileLoader>
        </div>
    );
}

export default AdvisorProfilePage; 