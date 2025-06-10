import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
    const navigate = useNavigate();
    const { login, loading: authLoading, error: authError } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

    // Xác thực input
    const validateInputs = () => {
        let isValid = true;
        
        // Reset lỗi
        setUsernameError("");
        setPasswordError("");
        setGeneralError("");
        
        // Kiểm tra tên đăng nhập
        if (!username.trim()) {
            setUsernameError("Vui lòng nhập tên đăng nhập");
            isValid = false;
        }
        
        // Kiểm tra mật khẩu
        if (!password.trim()) {
            setPasswordError("Vui lòng nhập mật khẩu");
            isValid = false;
        }
        
        return isValid;
    };

    const handleLogin = async () => {
        // Xác thực dữ liệu đầu vào
        if (!validateInputs()) {
            return;
        }

        setLoading(true);
        setGeneralError("");

        try {
            // Sử dụng hàm login từ AuthContext
            const result = await login(username, password);
            
            if (result.success) {
                // Kiểm tra role để chuyển hướng phù hợp
                const roleToCheck = result.role;
                
                if (['STUDENT', 'CLASS_COMMITTEE', 'ACADEMIC_ADVISOR', 'EMPLOYEE_FACULTY', 'EMPLOYEE_DEPARTMENT'].includes(roleToCheck)) {
                    navigate("/profile");
                } else {
                    navigate("/dashboard");
                }
            } else {
                // Hiển thị lỗi từ AuthContext - luôn hiển thị thông báo chung
                setGeneralError("Vui lòng kiểm tra tên đăng nhập hoặc mật khẩu");
            }
        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            // Luôn hiển thị thông báo chung khi đăng nhập thất bại
            setGeneralError("Vui lòng kiểm tra tên đăng nhập hoặc mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="w-full max-w-xs mx-auto rounded-md shadow-lg mb-5">
            <div className="bg-white p-4 rounded-md">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center bg-[#00AEEF] p-3 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    ĐĂNG NHẬP
                </h2>

                {/* Username field with icon */}
                <div className={`mb-1 flex items-center border rounded-md overflow-hidden ${usernameError ? 'border-red-500' : 'border-gray-300'}`}>
                    <div className={`px-3 py-2 ${usernameError ? 'bg-red-100 border-r border-red-500' : 'bg-gray-200 border-r border-gray-300'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${usernameError ? 'text-red-500' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if(e.target.value.trim()) setUsernameError("");
                        }}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-2 text-sm focus:outline-none ${usernameError ? 'bg-red-50' : 'bg-white'}`}
                    />
                </div>
                {usernameError && <p className="text-red-500 text-xs mb-3 ml-1">{usernameError}</p>}

                {/* Password field with icon + show/hide */}
                <div className={`mb-1 flex items-center border rounded-md overflow-hidden relative ${passwordError ? 'border-red-500' : 'border-gray-300'}`}>
                    <div className={`px-3 py-2 ${passwordError ? 'bg-red-100 border-r border-red-500' : 'bg-gray-200 border-r border-gray-300'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${passwordError ? 'text-red-500' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if(e.target.value.trim()) setPasswordError("");
                        }}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-2 text-sm focus:outline-none pr-10 ${passwordError ? 'bg-red-50' : 'bg-white'}`}
                    />
                    <div
                        className="absolute right-3 top-2.5 cursor-pointer text-gray-600 hover:text-gray-900"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </div>
                </div>
                {passwordError && <p className="text-red-500 text-xs mb-3 ml-1">{passwordError}</p>}

                <div className="text-right mb-3">
                    <a href="#" className="text-xs text-blue-600 hover:underline">
                        Quên mật khẩu
                    </a>
                </div>

                {(generalError || authError) && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-500 text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {generalError || authError}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading || authLoading}
                    className={`w-full bg-[#00AEEF] text-white p-2 rounded-md text-sm hover:bg-blue-600 flex items-center justify-center ${(loading || authLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {(loading || authLoading) ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý...
                        </span>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                            Đăng nhập
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default LoginForm;