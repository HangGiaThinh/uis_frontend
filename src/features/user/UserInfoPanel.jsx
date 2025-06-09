import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

function UserInfoPanel({ onLogout }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Trạng thái toggle

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            // Tách HoTen thành Ho và Ten
            const [ho, ...tenArray] = userInfo.HoTen.split(' ');
            const ten = tenArray.join(' ');
            const mockUser = {
                MaSV: userInfo.MaSV,
                Ho: ho,
                Ten: ten,
                EmailTruong: userInfo.EmailTruong || 'Không có email',
                Lop: 'E22CQCN2-N', // Thêm thông tin mở rộng (mock)
                Nganh: 'Công nghệ thông tin',
                Khoa: 'Đại học Chính quy',
                NamNhapHoc: '2022-2027',
            };
            setUser(mockUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('role');
        if (onLogout) onLogout();
        navigate('/');
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="rounded shadow-md bg-white overflow-hidden text-sm text-gray-700">
            <div className="bg-[#00AEEF] text-white px-3 py-2 flex items-center justify-between cursor-pointer" onClick={toggleExpand}>
                <div className="flex items-center gap-2 font-semibold text-white">
                    <User size={16} /> ĐĂNG NHẬP
                </div>
                <div className={`text-xl transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ›
                </div>
            </div>

            <div className="p-3">
                <div className="flex justify-between mb-1">
                    <span className="text-[#00AEEF]">Tài khoản</span>
                    <span className="font-semibold text-[#00AEEF]">{user.MaSV}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#00AEEF]">Họ tên</span>
                    <span className="font-semibold text-[#00AEEF]">{user.Ho} {user.Ten}</span>
                </div>

                {/* Thông tin mở rộng */}
                {isExpanded && (
                    <div className="mt-3 space-y-1">
                        <div className="flex justify-between">
                            <span className="text-[#00AEEF]">Email</span>
                            <span className="font-semibold text-[#00AEEF]">{user.EmailTruong}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#00AEEF]">Lớp</span>
                            <span className="font-semibold text-[#00AEEF]">{user.Lop}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#00AEEF]">Ngành</span>
                            <span className="font-semibold text-[#00AEEF]">{user.Nganh}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#00AEEF]">Hệ đào tạo</span>
                            <span className="font-semibold text-[#00AEEF]">{user.Khoa}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#00AEEF]">Niên khóa</span>
                            <span className="font-semibold text-[#00AEEF]">{user.NamNhapHoc}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center my-3">
                <button
                    onClick={handleLogout}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-20 rounded text-sm font-semibold text-[#00AEEF] flex items-center gap-2"
                >
                    <LogOut size={16} /> Đăng xuất
                </button>
            </div>

            <div className="p-2 italic text-center text-gray-500 text-sm">
                <a href="#" className="hover:underline">Đổi mật khẩu</a>
            </div>
        </div>
    );
}

export default UserInfoPanel;