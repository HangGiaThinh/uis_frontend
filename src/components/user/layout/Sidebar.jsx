import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaCog, FaChevronRight } from 'react-icons/fa';

function Sidebar() {
    const { isAuthenticated, user } = useAuth();

    const getFeaturesByRole = () => {
        if (!user?.role) return [];

        const roleFeatures = {
            STUDENT: [
                { label: "Đánh giá điểm rèn luyện", path: "/scores" },
                { label: "Gửi khiếu nại", path: "/complaints" },
                { label: "Kết quả học tập", path: "/academic-results" }
            ],
            CLASS_COMMITTEE: [
                { label: 'Đánh giá điểm rèn luyện', path: '/scores' },
                { label: 'Quản lý điểm rèn luyện', path: '/scores/manage' },
                { label: 'Gửi khiếu nại', path: '/complaints' }
            ],
            ACADEMIC_ADVISOR: [
                { label: 'Quản lý điểm rèn luyện', path: '/scores/manage' }
            ],
            EMPLOYEE_FACULTY: [
                { label: 'Quản lý điểm rèn luyện', path: '/scores/manage' }
            ],
            EMPLOYEE_DEPARTMENT: [
                { label: 'Tạo tài khoản', path: '/accounts/create' },
                { label: 'Quản lý sinh viên', path: '/students/manage' },
                { label: 'Quản lý điểm rèn luyện', path: '/scores/manage' },
                { label: 'Phản hồi khiếu nại', path: '/complaints/respond' }
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
                        <Link
                            to={feature.path}
                            className="flex items-center gap-2 px-4 py-2 text-[#00AEEF] hover:bg-[#e6f7fd] hover:font-semibold transition-colors duration-150 text-sm"
                        >
                            <FaChevronRight className="text-xs" />
                            <span className="truncate">{feature.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
