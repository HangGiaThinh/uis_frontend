import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import LoginForm from '../../features/auth/LoginForm'; // Import LoginForm
import UserInfoPanel from '../../features/user/UserInfoPanel';

function MainLayout() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            setUserInfo(user);
        }
    }, []);

    const handleLogin = (user) => {
        setUserInfo(user);
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Nội dung chính */}
                <div className="w-[80%] p-4 bg-white overflow-y-auto">
                    <Outlet />
                </div>

                {/* Right: Thông tin người dùng + Sidebar */}
                <div className="w-[20%] flex flex-col overflow-y-auto p-2 bg-[#f8f9fa]">
                    <div className="flex-1 overflow-y-auto">
                        {userInfo ? (
                            <>
                                <UserInfoPanel onLogout={() => setUserInfo(null)} />
                                <div className="mt-4">
                                    <Sidebar />
                                </div>
                            </>
                        ) : (
                            <LoginForm onLogin={handleLogin} />
                        )}
                    </div>
                </div>
            </div>


            {/* Footer */}
            <Footer />
        </div>
    );
}

export default MainLayout;