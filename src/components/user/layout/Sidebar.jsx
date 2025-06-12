import React from 'react';
import { useAuth } from '../../../context/AuthContext';

function Sidebar() {
    const { isAuthenticated } = useAuth();

    const features = [
        'Thông báo tới ban quản trị',
        'Xem chương trình hành động',
        'Xem môn học tiên quyết',
        'Đăng ký môn học',
        'Đăng ký môn nguyên vẹn',
        'Xem học phí',
        'Hóa đơn điện tử',
        'Thời khóa biểu đăng tải',
        'Thời khóa biểu đăng học kỳ',
        'Xem lịch thi',
        'Xem điểm',
        'Cập nhật thông tin trường...',
        'Gửi kiến ban quản trị',
    ];

    if (!isAuthenticated) return null;

    return (
        <aside className="bg-white text-[#00AEEF] p-4 shadow-md rounded-md w-full">
            <h2 className="text-lg font-semibold text-[#00AEEF] mb-3 border-b pb-1">TÍNH NĂNG</h2>
            <ul className="space-y-2 text-sm">
                {features.map((feature, index) => (
                    <li key={index}>
                        <a href="#" className="block hover:text-[#00AEEF] hover:underline">
                            {feature}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;