import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            setUserInfo(user);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('role');
        navigate('/'); // Điều hướng lại để hiển thị form đăng nhập
    };

    return (
        <header className="bg-[#00AEEF] text-white p-2 flex justify-between items-center mb-5">
            <div className="space-x-4">
                <a href="/" className="hover:underline">Trang chủ</a>
                <a href="/profile" className="hover:underline">Thông tin</a>
            </div>

            {userInfo && (
                <div className="flex items-center space-x-2">
                    <span>Thông tin</span>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src="/default-avatar.png" alt="User Avatar" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <span>Tài khoản: {userInfo.MaSV}</span>
                            </li>
                            <li>
                                <span>Họ tên: {userInfo.Ho} {userInfo.Ten}</span>
                            </li>
                            <li>
                                <a onClick={handleLogout} className="text-orange-500 hover:text-orange-600">
                                    Đăng xuất
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;