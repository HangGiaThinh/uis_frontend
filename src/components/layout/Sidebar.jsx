import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCog, FaChevronRight } from 'react-icons/fa';

function Sidebar() {
    const { isAuthenticated, user } = useAuth();

    const getFeaturesByRole = () => {
        if (!user?.role) return [];

        const roleFeatures = {
            STUDENT: [
                'Đánh giá điểm rèn luyện',
                'Gửi khiếu nại'
            ],
            CLASS_COMMITTEE: [
                'Đánh giá điểm rèn luyện',
                'Quản lý điểm rèn luyện',
                'Gửi khiếu nại'
            ],
            ACADEMIC_ADVISOR: [
                'Quản lý điểm rèn luyện'
            ],
            EMPLOYEE_FACULTY: [
                'Quản lý điểm rèn luyện'
            ],
            EMPLOYEE_DEPARTMENT: [
                'Tạo tài khoản',
                'Quản lý sinh viên',
                'Quản lý điểm rèn luyện',
                'Phản hồi khiếu nại'
            ]
        };

        return roleFeatures[user.role] || [];
    };

    if (!isAuthenticated) return null;
    
    const features = getFeaturesByRole();
    
    return (
        <aside className="w-full bg-white shadow rounded-md">
            <div className="flex items-center gap-2 bg-[#00AEEF] text-white px-4 py-3 rounded-t-md border-b">
                <FaCog className="text-lg" />
                <h2 className="text-base font-semibold tracking-wide">TÍNH NĂNG</h2>
            </div>
            <ul className="divide-y divide-gray-200">
                {features.map((feature, index) => (
                    <li key={index}>
                        <a
                            href="#"
                            className="flex items-center gap-2 px-4 py-2 text-[#00AEEF] hover:bg-[#e6f7fd] hover:font-semibold transition-colors duration-150 text-sm"
                        >
                            <FaChevronRight className="text-xs" />
                            <span className="truncate">{feature}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;