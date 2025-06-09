import React, { useEffect, useState } from 'react';

function PersonalInfo() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            const mockUser = {
                MaSV: userInfo.MaSV,
                Ho: userInfo.Ho,
                Ten: userInfo.Ten,
                NgaySinh: userInfo.NgaySinh,
                GioiTinh: userInfo.GioiTinh ? 'Nam' : 'Nữ',
                CCCD: '0345001645',
            };
            setUser(mockUser);
        }
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-bold text-lg mb-2">Thông tin cá nhân</h3>
            <div className="space-y-1">
                <p><strong>Mã SV:</strong> {user.MaSV}</p>
                <p><strong>Họ tên:</strong> {user.Ho} {user.Ten}</p>
                <p><strong>Ngày sinh:</strong> {user.NgaySinh}</p>
                <p><strong>Giới tính:</strong> {user.GioiTinh}</p>
                <p><strong>Số CMND/CCCD:</strong> {user.CCCD}</p>
            </div>
        </div>
    );
}

export default PersonalInfo;