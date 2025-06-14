import ChangePasswordForm from "../../components/profile/ChangePasswordForm";

import React, { useState } from "react";

const ChangePasswordPage = () => {
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-[#00AEEF] text-white p-2 text-center">
                <h2>Đặt lại mật khẩu</h2>
            </div>

            {/* Main Content */}
            <div className="p-4">
                {errorMessage && (
                    <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                        {errorMessage}
                    </div>
                )}
                <ChangePasswordForm setErrorMessage={setErrorMessage} />
            </div>
        </div>
    );
};

export default ChangePasswordPage;