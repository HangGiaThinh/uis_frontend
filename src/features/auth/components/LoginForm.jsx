// src/features/auth/components/LoginForm.jsx
import { useState } from "react";

function LoginForm({ onSubmit, loading = false, errorMessage = "" }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateInputs = () => {
        let isValid = true;
        setUsernameError("");
        setPasswordError("");

        if (!username.trim()) {
            setUsernameError("Vui lòng nhập tên đăng nhập");
            isValid = false;
        }
        if (!password.trim()) {
            setPasswordError("Vui lòng nhập mật khẩu");
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateInputs()) return;
        onSubmit?.({ username, password });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="w-full max-w-xs mx-auto rounded-md shadow-lg mb-5">
            <div className="bg-white p-4 rounded-md">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center bg-[#00AEEF] p-3 rounded-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    ĐĂNG NHẬP
                </h2>

                {/* Username */}
                <div className={`mb-1 flex items-center border rounded-md overflow-hidden ${usernameError ? "border-red-500" : "border-gray-300"}`}>
                    <div className={`px-3 py-2 ${usernameError ? "bg-red-100 border-r border-red-500" : "bg-gray-200 border-r border-gray-300"}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-5 h-5 ${usernameError ? "text-red-500" : "text-gray-700"}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (e.target.value.trim()) setUsernameError("");
                        }}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-2 text-sm focus:outline-none ${usernameError ? "bg-red-50" : "bg-white"}`}
                    />
                </div>
                {usernameError && <p className="text-red-500 text-xs mb-3 ml-1">{usernameError}</p>}

                {/* Password */}
                <div className={`mb-1 flex items-center border rounded-md overflow-hidden relative ${passwordError ? "border-red-500" : "border-gray-300"}`}>
                    <div className={`px-3 py-2 ${passwordError ? "bg-red-100 border-r border-red-500" : "bg-gray-200 border-r border-gray-300"}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-5 h-5 ${passwordError ? "text-red-500" : "text-gray-700"}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.trim()) setPasswordError("");
                        }}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-2 text-sm focus:outline-none pr-10 ${passwordError ? "bg-red-50" : "bg-white"}`}
                    />
                    <div
                        className="absolute right-3 top-2.5 cursor-pointer text-gray-600 hover:text-gray-900"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            // Hide password icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                <path d="M13.12 14.12a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            // Show password icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </div>
                </div>
                {passwordError && <p className="text-red-500 text-xs mb-3 ml-1">{passwordError}</p>}

                {/* Forgot password */}
                <div className="text-right mb-3">
                    <a href="#" className="text-xs text-blue-600 hover:underline">Quên mật khẩu</a>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-500 text-sm flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {errorMessage}
                        </p>
                    </div>
                )}

                {/* Submit button with icon */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full bg-[#00AEEF] text-white p-2 rounded-md text-sm hover:bg-blue-600 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {!loading && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    )}
                    {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
            </div>
        </div>
    );
}

export default LoginForm;
