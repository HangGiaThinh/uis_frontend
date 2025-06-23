import React, { useState, useEffect } from "react";
import { User, Pencil, BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import profileApi from "../../services/profile/profileApi";

function StudentProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState(null);
  const [academicResults, setAcademicResults] = useState([]);
  const [averageGPA, setAverageGPA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadProfile, setReloadProfile] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadData();
  }, [reloadProfile]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, academicRes, gpaRes] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getAcademicResults(),
        profileApi.getAverageGPA(),
      ]);

      setProfile(profileRes.data);
      setAcademicResults(academicRes);
      setAverageGPA(gpaRes);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onSubmit = async (data) => {
    try {
      await profileApi.updateProfile(data, avatar);
      setIsEditing(false);
      setReloadProfile((v) => v + 1);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500">
        Không thể tải thông tin sinh viên
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-[#40ACE9]">
        Thông tin Sinh viên
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/3">
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <label className="cursor-pointer">
                    {profile.imagePath ? (
                      <img
                        src={profile.imagePath}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.lastName}
                      {...register("lastName", {
                        required: "Vui lòng nhập họ",
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.firstName}
                      {...register("firstName", {
                        required: "Vui lòng nhập tên",
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  defaultValue={profile.dateOfBirth}
                  {...register("dateOfBirth", {
                    required: "Vui lòng nhập ngày sinh",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                />
              </div>

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
                  defaultValue={profile.phoneNumber}
                  {...register("phoneNumber", {
                    required: "Vui lòng nhập số điện thoại",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CMND/CCCD
                </label>
                <input
                  type="text"
                  defaultValue={profile.citizenId}
                  {...register("citizenId", {
                    required: "Vui lòng nhập CMND/CCCD",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email trường
                </label>
                <input
                  type="email"
                  defaultValue={profile.universityEmail}
                  {...register("universityEmail", {
                    required: "Vui lòng nhập email trường",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email cá nhân
                </label>
                <input
                  type="email"
                  defaultValue={profile.personalEmail}
                  {...register("personalEmail")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quê quán
                </label>
                <input
                  type="text"
                  defaultValue={profile.hometown}
                  {...register("hometown")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ hiện tại
                </label>
                <input
                  type="text"
                  defaultValue={profile.address}
                  {...register("address")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ thường trú
                </label>
                <input
                  type="text"
                  defaultValue={profile.permanentAddress}
                  {...register("permanentAddress")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dân tộc
                </label>
                <input
                  type="text"
                  defaultValue={profile.ethnicity}
                  {...register("ethnicity")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40ACE9] focus:ring-[#40ACE9] border px-3 py-2"
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
                className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group"
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
                {profile.imagePath ? (
                  <img
                    src={profile.imagePath}
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
                  ["MSSV", profile.studentId],
                  ["Họ và tên", `${profile.lastName} ${profile.firstName}`],
                  [
                    "Ngày sinh",
                    new Date(profile.dateOfBirth).toLocaleDateString("vi-VN"),
                  ],
                  ["Giới tính", profile.gender ? "Nam" : "Nữ"],
                  ["Số điện thoại", profile.phoneNumber],
                  ["CMND/CCCD", profile.citizenId],
                  ["Email trường", profile.universityEmail],
                  ["Email cá nhân", profile.personalEmail || "Chưa cập nhật"],
                  ["Quê quán", profile.hometown || "Chưa cập nhật"],
                  ["Địa chỉ hiện tại", profile.address || "Chưa cập nhật"],
                  [
                    "Địa chỉ thường trú",
                    profile.permanentAddress || "Chưa cập nhật",
                  ],
                  ["Dân tộc", profile.ethnicity || "Chưa cập nhật"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between w-full">
                    <span className="font-semibold min-w-[120px]">
                      {label}:
                    </span>
                    <span className="text-left">{value}</span>
                  </div>
                ))}
              </div>

              {/* Thông tin khóa học */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[#40ACE9] border-b border-[#40ACE9] mb-2 pb-1">
                  Thông tin khóa học
                </h2>
                {[
                  ["Lớp", profile.studentClass?.id],
                  ["Chuyên ngành", profile.studentMajor?.name],
                  ["Khoa", profile.studentFaculty?.name],
                  ["Bậc hệ đào tạo", profile.studentClass?.educationLevel],
                  ["Niên khóa", profile.studentClass?.academicYear],
                  [
                    "GPA trung bình",
                    averageGPA ? averageGPA.toFixed(2) : "Chưa có",
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between w-full">
                    <span className="font-semibold min-w-[120px]">
                      {label}:
                    </span>
                    <span className="text-left">
                      {value || "Chưa cập nhật"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Academic Results Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E7EF]">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#40ACE9]" />
          <h2 className="text-xl font-bold text-[#40ACE9]">Kết quả học tập</h2>
        </div>

        {academicResults.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full border border-[#E0E7EF] rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#40ACE9] text-white">
                  <th className="py-3 px-4 border border-[#E0E7EF] text-center">STT</th>
                  <th className="py-3 px-4 border border-[#E0E7EF] text-center">Học kỳ</th>
                  <th className="py-3 px-4 border border-[#E0E7EF] text-center">Năm học</th>
                  <th className="py-3 px-4 border border-[#E0E7EF] text-center">GPA</th>
                </tr>
              </thead>
              <tbody>
                {academicResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border border-[#E0E7EF] text-center">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border border-[#E0E7EF] text-center">
                      {result.semesterOrder}
                    </td>
                    <td className="py-3 px-4 border border-[#E0E7EF] text-center">
                      {result.semesterYear}
                    </td>
                    <td className="py-3 px-4 border border-[#E0E7EF] text-center font-semibold">
                      <span
                        className={`px-2 py-1 rounded ${
                          result.gpa >= 3.5
                            ? "bg-green-100 text-green-800"
                            : result.gpa >= 3.0
                            ? "bg-blue-100 text-blue-800"
                            : result.gpa >= 2.5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.gpa}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {averageGPA && (
              <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-[#E0F3FC] to-[#F0FAFF] shadow-md border border-[#40ACE9]/30">
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#127FBF] tracking-wide">
                    GPA: {averageGPA.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Không có dữ liệu kết quả học tập.
          </p>
        )}
      </div>
        </div>
    );
}

export default StudentProfilePage;
