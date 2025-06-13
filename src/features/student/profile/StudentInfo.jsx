import React, { useEffect, useState } from 'react';

function StudentInfo() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            const mockUser = {
                EmailTruong: userInfo.EmailTruong,
                DiaChi: '77 Minh Phụng, Phường 9, Quận 6, Tp. Hồ Chí Minh',
                Lop: 'E22CQCN2-N',
                Nganh: 'Công nghệ thông tin',
                Khoa: 'Đại học Chính quy',
                NamNhapHoc: '2022-2027',
            };
            setUser(mockUser);
        }
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-bold text-lg mb-2">Thông tin sinh viên</h3>
            <div className="space-y-1">
                <p><strong>Email:</strong> {user.EmailTruong}</p>
                <p><strong>Địa chỉ:</strong> {user.DiaChi}</p>
                <p><strong>Lớp:</strong> {user.Lop}</p>
                <p><strong>Ngành:</strong> {user.Nganh}</p>
                <p><strong>Hệ đào tạo:</strong> {user.Khoa}</p>
                <p><strong>Niên khóa:</strong> {user.NamNhapHoc}</p>
            </div>
        </div>
    );
}

export default StudentInfo;