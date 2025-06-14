import React, { useState } from "react";
import { User, Pencil } from "lucide-react";
import FacultyProfileLoader from "../../components/profile/FacultyProfileLoader";
import { useForm } from "react-hook-form";
import profileApi from "../../services/profile/profileApi";

function FacultyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [reloadProfile, setReloadProfile] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onSubmit = async (data) => {
    try {
      await profileApi.updateProfile(data, avatar);
      setIsEditing(false);
      setReloadProfile((v) => v + 1);
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
      <h1 className="text-2xl font-bold mb-4">Thông tin Nhân viên Khoa</h1>
      <FacultyProfileLoader reload={reloadProfile}>
        {({ profile }) =>
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
                        <label className="block text-sm font-medium text-gray-700">
                          Họ
                        </label>
                        <input
                          type="text"
                          defaultValue={profile.last_name}
                          {...register("last_name", {
                            required: "Vui lòng nhập họ",
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.last_name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tên
                        </label>
                        <input
                          type="text"
                          defaultValue={profile.first_name}
                          {...register("first_name", {
                            required: "Vui lòng nhập tên",
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.first_name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.first_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Giới tính
                      </label>
                      <div className="mt-1 space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="true"
                            defaultChecked={profile.gender}
                            {...register("gender", {
                              required: "Vui lòng chọn giới tính",
                            })}
                            className="form-radio"
                          />
                          <span className="ml-2">Nam</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="false"
                            defaultChecked={!profile.gender}
                            {...register("gender")}
                            className="form-radio"
                          />
                          <span className="ml-2">Nữ</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        defaultValue={profile.phone_number}
                        {...register("phone_number", {
                          required: "Vui lòng nhập số điện thoại",
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={profile.email}
                        {...register("email", {
                          required: "Vui lòng nhập email",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email không hợp lệ",
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CCCD
                      </label>
                      <input
                        type="text"
                        defaultValue={profile.citizen_id}
                        {...register("citizen_id", {
                          required: "Vui lòng nhập CCCD",
                        })}
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
                      className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group mt-4 md:mt-0"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 bg-white rounded-xl">
                  {/* Top: Avatar + Edit Button */}
                  <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      {profile.image_url ? (
                        <img
                          src={profile.image_url}
                          alt="Avatar"
                          className="w-32 h-32 object-cover rounded-full border-4 border-[#40ACE9] shadow"
                        />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border-4 border-[#40ACE9]">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group mt-4 md:mt-0"
                    >
                      <Pencil className="w-4 h-4 group-hover:text-white" />
                      <span>Chỉnh sửa</span>
                    </button>
                  </div>

                  {/* Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Thông tin cá nhân */}
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-[#40ACE9] border-b border-[#40ACE9] mb-2 pb-1">
                        Thông tin cá nhân
                      </h2>
                      {[
                        ["Mã nhân viên", profile.id],
                        ["Họ và tên", `${profile.last_name} ${profile.first_name}`],
                        ["Giới tính", profile.gender ? "Nam" : "Nữ"],
                        ["Số điện thoại", profile.phone_number],
                        ["CCCD", profile.citizen_id],
                        ["Email", profile.email],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between w-full">
                          <span className="font-semibold min-w-[120px]">{label}:</span>
                          <span className="text-left">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Thông tin chuyên môn */}
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-[#40ACE9] border-b border-[#40ACE9] mb-2 pb-1">
                        Thông tin chuyên môn
                      </h2>
                      {[
                        ["Khoa", profile.employee_department?.name],
                        // ["Vai trò", profile.employee_role?.name],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between w-full">
                          <span className="font-semibold min-w-[120px]">{label}:</span>
                          <span className="text-left">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null
        }
      </FacultyProfileLoader>
    </div>
  );
}

export default FacultyProfilePage; 