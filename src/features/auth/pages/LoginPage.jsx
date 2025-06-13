// src/features/auth/pages/LoginPage.jsx
// Trang đăng nhập, xử lý logic đăng nhập và điều hướng
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../../../context/AuthContext"

function LoginPage() {
    const navigate = useNavigate();
    const { login, loading: authLoading, error: authError } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async ({ username, password }) => {
        setErrorMessage("");
        try {
            const result = await login(username, password);
            if (result.success) {
                // Điều hướng sẽ được xử lý trong AuthContext (nếu có shouldRedirectToProfile)
                navigate(result.role ? "/profile" : "/dashboard"); // Fallback
            } else {
                setErrorMessage(result.error || "Vui lòng kiểm tra tên đăng nhập hoặc mật khẩu");
            }
        } catch (err) {
            setErrorMessage(authError || "Vui lòng kiểm tra tên đăng nhập hoặc mật khẩu");
        }
    };

    return (
        <div className="min-h-screen flex justify-center bg-gray-100">
            <LoginForm
                onSubmit={handleLogin}
                loading={authLoading}
                errorMessage={errorMessage || authError}
            />
        </div>
    );
}

export default LoginPage;