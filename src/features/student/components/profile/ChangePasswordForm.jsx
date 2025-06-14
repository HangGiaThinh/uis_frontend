import React, { useState } from "react";
import profileApi from "../../services/profile/profileApi";

const ChangePasswordForm = ({ setErrorMessage }) => {
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (setErrorMessage) setErrorMessage("");

        if (formData.new_password !== formData.confirm_password) {
            if (setErrorMessage) setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return;
        }

        try {
            const response = await profileApi.changePassword(formData);
            setMessage(response.data.response_message);
            setFormData({ old_password: "", new_password: "", confirm_password: "" });
            if (setErrorMessage) setErrorMessage("");
        } catch (error) {
            if (setErrorMessage) setErrorMessage(error.response?.data?.message || "Đã có lỗi xảy ra khi đổi mật khẩu");
        }
    };

    return (
        <div className="p-4 bg-white rounded">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu cũ</label>
                    <input
                        type="password"
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#00AEEF] text-white py-2 rounded hover:bg-blue-600"
                >
                    Thay đổi mật khẩu
                </button>
            </form>
            {message && <p className="text-green-500 mt-2">{message}</p>}
        </div>
    );
};

export default ChangePasswordForm;