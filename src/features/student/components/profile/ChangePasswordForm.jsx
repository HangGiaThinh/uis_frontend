import React, { useState } from "react";
import profileApi from "../../services/profile/profileApi";
import { FaLock, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';

const ChangePasswordForm = ({ setErrorMessage }) => {
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [message, setMessage] = useState("");
    const [showPasswords, setShowPasswords] = useState({
        old_password: false,
        new_password: false,
        confirm_password: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);
        if (setErrorMessage) setErrorMessage("");

        if (formData.new_password !== formData.confirm_password) {
            if (setErrorMessage) setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp");
            setIsLoading(false);
            return;
        }

        try {
            const response = await profileApi.changePassword(formData);
            setMessage(response.data.response_message);
            setFormData({ old_password: "", new_password: "", confirm_password: "" });
            if (setErrorMessage) setErrorMessage("");
        } catch (error) {
            if (setErrorMessage) setErrorMessage(error.response?.data?.message || "Đã có lỗi xảy ra khi đổi mật khẩu");
        } finally {
            setIsLoading(false);
        }
    };

    const renderPasswordField = (name, label, placeholder) => (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                    type={showPasswords[name] ? "text" : "password"}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40ACE9] focus:border-transparent transition-all"
                    placeholder={placeholder}
                    required
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility(name)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#40ACE9] transition-colors"
                >
                    {showPasswords[name] ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-lg border border-[#40ACE9] p-6">
            {/* Header */}
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                <FaLock className="text-2xl text-[#40ACE9] mr-3" />
                <h1 className="text-2xl font-bold text-[#40ACE9]">ĐỔI MẬT KHẨU</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {renderPasswordField("old_password", "Mật khẩu hiện tại", "Nhập mật khẩu hiện tại...")}
                {renderPasswordField("new_password", "Mật khẩu mới", "Nhập mật khẩu mới...")}
                {renderPasswordField("confirm_password", "Xác nhận mật khẩu mới", "Nhập lại mật khẩu mới...")}

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#40ACE9] text-white rounded-lg hover:bg-[#359bd9] transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        <FaCheck className="w-4 h-4" />
                        {isLoading ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
                    </button>
                </div>
            </form>

            {/* Success Message */}
            {message && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        <p className="text-green-700 font-medium">{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangePasswordForm;