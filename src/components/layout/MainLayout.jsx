import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import LoginForm from '../../features/auth/LoginForm';
import UserInfoPanel from '../../features/home/UserInfoPanel';
import { useAuth } from '../../context/AuthContext';

function MainLayout() {
    const { isAuthenticated, user } = useAuth();

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
                        {isAuthenticated ? (
                            <>
                                <UserInfoPanel />
                                <div className="mt-4">
                                    <Sidebar />
                                </div>
                            </>
                        ) : (
                            <LoginForm />
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