import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function UserInfoPanel() {
    const navigate = useNavigate();
    const { user: authUser, role, position, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (authUser) {
            const userInfo = {
                userId: authUser.user_id || '',
                fullName: authUser.full_name || '',
                email: authUser.email || 'Không có email',
                role: role || '',
                position: position || '',
            };
            setUser(userInfo);
        }
    }, [authUser, role, position]);

    const handleLogout = () => {
        logout();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (!user) return <div>Loading...</div>;

    const roleDisplay = user.role === 'STUDENT' ? 'Sinh viên' : user.role === 'ACADEMIC_ADVISOR' ? 'Cố vấn học tập' : user.role === 'CLASS_COMMITTEE' ? 'Ban cán sự lớp' : user.role === 'EMPLOYEE_FACULTY' ? 'Nhân viên khoa' : user.role === 'EMPLOYEE_DEPARTMENT' ? 'Nhân viên phòng ban' : user.role;
    const positionDisplay = user.position ? user.position : '';
    let rolePositionDisplay = roleDisplay;
    if (positionDisplay) {
        rolePositionDisplay = roleDisplay + ` - ${positionDisplay}`;
    }

    const handleChangePassword = () => {
        navigate('/change-password');
    };

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

            {isExpanded && (
                <div className="p-3">
                    <div className="flex justify-between mb-1">
                        <span className="text-[#00AEEF]">Tài khoản</span>
                        <span className="font-semibold text-[#00AEEF]">{user.userId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#00AEEF]">Họ tên</span>
                        <span className="font-semibold text-[#00AEEF]">{user.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#00AEEF]">Email</span>
                        <span className="font-semibold text-[#00AEEF]">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#00AEEF]">Vai trò</span>
                        <span className="font-semibold text-[#00AEEF]">{rolePositionDisplay}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-center my-3">
                <button
                    onClick={handleLogout}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-20 rounded text-sm font-semibold flex items-center gap-2"
                >
                    <LogOut size={16} /> Đăng xuất
                </button>
            </div>

            <div className="p-2 italic text-center text-gray-500 text-sm">
                <button onClick={handleChangePassword} className="hover:underline">
                    Đổi mật khẩu
                </button>
            </div>
        </div>
    );
}

export default UserInfoPanel;