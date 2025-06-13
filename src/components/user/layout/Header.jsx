import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Menu } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

function Header() {
    const { isAuthenticated, user, role } = useAuth(); // Thêm role
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="bg-[#00AEEF] text-white shadow-md">
            <div className="max-w-8xl mx-auto px-12 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center mr-10">
                        <span className="font-bold text-xl">HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</span>
                    </div>

                    {/* Menu bên phải */}
                    <nav className="hidden md:flex items-center space-x-6 ml-3">
                        <Link to="/" className="flex items-center gap-1.5 py-1 px-2 rounded-md transition-all duration-200 hover:bg-white/20">
                            <Home size={18} />
                            <span>Trang chủ</span>
                        </Link>

                        {isAuthenticated && (
                            <Link to="/profile" className="flex items-center gap-1.5 py-1 px-2 rounded-md transition-all duration-200 hover:bg-white/20">
                                <User size={18} />
                                <span>Thông tin</span>
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 rounded-md hover:bg-white/20 transition-colors">
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </header>

    );
}

export default Header;