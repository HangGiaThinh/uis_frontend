import React, { useState } from "react";
import StudentProfileLoader from "../../components/profile/StudentProfileLoader";
import StudentAverageGPAPage from "../academic/StudentAverageGPAPage";
import StudentProfileUpdateForm from "../../components/profile/StudentProfileUpdateForm";

function StudentProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Thông tin Sinh viên</h1>

            <StudentProfileLoader>
                {({ profile }) => (
                    profile ? (
                        <>
                            <div className="bg-white p-6 rounded-lg shadow-md space-y-2">
                                <p><strong>MSSV:</strong> {profile.studentId}</p>
                                <p><strong>Họ và tên:</strong> {profile.lastName} {profile.firstName}</p>
                                <p><strong>Ngày sinh:</strong> {profile.dateOfBirth}</p>
                                <p><strong>Giới tính:</strong> {profile.gender ? "Nam" : "Nữ"}</p>
                                <p><strong>Số điện thoại:</strong> {profile.phoneNumber}</p>
                                <p><strong>CMND/CCCD:</strong> {profile.citizenId}</p>
                                <p><strong>Email trường:</strong> {profile.universityEmail}</p>
                                <p><strong>Chuyên ngành:</strong> {profile.studentMajor?.name}</p>
                                <p><strong>Lớp:</strong> {profile.studentClass?.id} ({profile.studentClass?.educationLevel}, {profile.studentClass?.academicYear})</p>
                                <p><strong>Khoa:</strong> {profile.studentFaculty?.name}</p>

                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {isEditing ? "Ẩn chỉnh sửa" : "Chỉnh sửa"}
                                </button>
                            </div>

                            {isEditing && (
                                <StudentProfileUpdateForm initialData={profile} onSuccess={() => setIsEditing(false)} />
                            )}
                        </>
                    ) : <p>Không có dữ liệu để hiển thị.</p>
                )}
            </StudentProfileLoader>

            <StudentAverageGPAPage />
        </div>
    );
}

export default StudentProfilePage;
