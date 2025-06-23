import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import React, { useState } from "react";

const ChangePasswordPage = () => {
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700 font-medium">{errorMessage}</p>
                        </div>
                    </div>
                )}
                
                {/* Change Password Form */}
                <ChangePasswordForm setErrorMessage={setErrorMessage} />
            </div>
        </div>
    );
};

export default ChangePasswordPage;