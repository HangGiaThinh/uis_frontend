import React from "react";

function StudentProfile({ profile }) {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-blue-600">Thông Tin Sinh Viên</h1>
            {profile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>Mã sinh viên:</strong> {profile.studentId}</p>
                        <p><strong>Họ:</strong> {profile.lastName}</p>
                        <p><strong>Tên:</strong> {profile.firstName}</p>
                        <p><strong>Ngày sinh:</strong> {profile.dateOfBirth}</p>
                        <p><strong>Giới tính:</strong> {profile.gender ? "Nam" : "Nữ"}</p>
                        <p><strong>Số điện thoại:</strong> {profile.phoneNumber || "Chưa cập nhật"}</p>
                        <p><strong>CMND/CCCD:</strong> {profile.citizenId || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                        <p><strong>Email trường:</strong> {profile.universityEmail}</p>
                        <p><strong>Email cá nhân:</strong> {profile.personalEmail || "Chưa cập nhật"}</p>
                        <p><strong>Đường dẫn ảnh:</strong> {profile.imagePath || "Chưa cập nhật"}</p>
                        <p><strong>Quê quán:</strong> {profile.hometown || "Chưa cập nhật"}</p>
                        <p><strong>Địa chỉ:</strong> {profile.address || "Chưa cập nhật"}</p>
                        <p><strong>Địa chỉ thường trú:</strong> {profile.permanentAddress || "Chưa cập nhật"}</p>
                        <p><strong>Dân tộc:</strong> {profile.ethnicity || "Chưa cập nhật"}</p>
                        <p><strong>Trạng thái:</strong> {profile.status ? "Hoạt động" : "Ngưng hoạt động"}</p>
                    </div>
                    <div className="md:col-span-2 mt-4">
                        <p><strong>Tài khoản:</strong> {profile.studentAccount.username} (ID: {profile.studentAccount.id})</p>
                        <p><strong>Chuyên ngành:</strong> {profile.studentMajor.name} (Mã: {profile.studentMajor.id})</p>
                        <p><strong>Lớp:</strong> {profile.studentClass.id} ({profile.studentClass.educationLevel}, {profile.studentClass.academicYear})</p>
                        <p><strong>Khoa:</strong> {profile.studentFaculty.name} (Mã: {profile.studentFaculty.id})</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentProfile; 