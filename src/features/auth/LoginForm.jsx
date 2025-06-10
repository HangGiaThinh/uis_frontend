import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "../../services/mockData"; // Import mockUsers

function LoginForm({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = () => {
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      // Lưu thông tin vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(user.info));
      localStorage.setItem("role", user.role);
      // Tạo token giả lập (thay bằng logic thực tế nếu có API)
      const token = `mock-token-${user.username}`; // Ví dụ token
      localStorage.setItem("token", token);

      // Gọi callback onLogin
      if (onLogin) {
        onLogin(user.info);
      }

      setError("");
      // Thêm timeout để đảm bảo localStorage được cập nhật
      setTimeout(() => {
        navigate("/profile");
      }, 100);
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

    return (
        <div className="w-full max-w-xs mx-auto rounded-md shadow-lg mb-5">
            <div className="bg-white p-4 rounded-md">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center bg-[#00AEEF] p-3">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 100 12A6 6 0 0010 2zm0 14c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
                    </svg>
                    ĐĂNG NHẬP
                </h2>

                {/* Username field with icon */}
                <div className="mb-3 flex items-center border rounded-md bg-gray-100">
                    <div className="px-3 py-2 bg-gray-200 border-r">
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-3.33 0-6 1.34-6 3v1h12v-1c0-1.66-2.67-3-6-3z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 text-sm bg-gray-100 focus:outline-none"
                    />
                </div>

                {/* Password field with icon + show/hide */}
                <div className="mb-3 flex items-center border rounded-md bg-gray-100 relative">
                    <div className="px-3 py-2 bg-gray-200 border-r">
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1v-9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v2H8V6z" />
                        </svg>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 text-sm bg-gray-100 focus:outline-none pr-10"
                    />
                    <div
                        className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4.293 4.293a1 1 0 011.414 0l10 10a1 1 0 01-1.414 1.414L12.9 13.9A7.964 7.964 0 0110 14c-4.418 0-8-4-8-4a15.38 15.38 0 012.646-2.772L4.293 5.707a1 1 0 010-1.414zM10 6a2 2 0 012 2c0 .34-.09.66-.24.94l-2.7-2.7c.28-.15.6-.24.94-.24zm6.657 6.657A15.46 15.46 0 0018 10s-3.582-4-8-4c-.832 0-1.63.136-2.378.38l1.632 1.632A2 2 0 0112 10a2 2 0 01-2 2c-.556 0-1.06-.226-1.414-.586l-1.79-1.79A8.02 8.02 0 002 10s3.582 4 8 4c1.422 0 2.754-.374 3.9-1.015l1.757 1.757a1 1 0 001.414-1.414l-1.414-1.414z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 4c-4.418 0-8 4-8 4s3.582 4 8 4 8-4 8-4-3.582-4-8-4zm0 6a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        )}
                    </div>
                </div>

                <div className="text-right mb-3">
                    <a href="#" className="text-xs text-blue-600 hover:underline">
                        Quên mật khẩu
                    </a>
                </div>

                {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

                <button
                    onClick={handleLogin}
                    className="w-full bg-[#00AEEF] text-white p-2 rounded-md text-sm hover:bg-blue-600 flex items-center justify-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 10a1 1 0 011-1h10.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L14.586 11H4a1 1 0 01-1-1z" />
                    </svg>
                    Đăng nhập
                </button>
            </div>
        </div>
    );
}

export default LoginForm;