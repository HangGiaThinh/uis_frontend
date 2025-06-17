import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import accountApi from "../../services/account/accountApi";
import { X } from "lucide-react";

function AccountForm({ account, onClose }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const roles = [
        { id: 1, name: "STUDENT" },
        { id: 2, name: "CLASS_COMMITTEE" },
        { id: 3, name: "ACADEMIC_ADVISOR" },
        { id: 4, name: "EMPLOYEE_FACULTY" },
        { id: 5, name: "EMPLOYEE_DEPARTMENT" },
    ];

    useEffect(() => {
        if (account) {
            // Set form values when an account is selected for editing
            reset({
                username: account.username,
                password: "", // Password should not be pre-filled for security
                roleId: account.accountRole?.roleId.toString(), // Use accountRole.roleId
            });
        } else {
            // Reset form for new account creation
            reset({
                username: "",
                password: "",
                roleId: "",
            });
        }
    }, [account, reset]);

    const onSubmit = async (data) => {
        try {
            if (account) {
                // Update existing account
                const selectedRole = roles.find(r => r.id === parseInt(data.roleId));
                await accountApi.updateAccount({
                    id: account.userId, // Use userId for update
                    username: data.username,
                    password: data.password || undefined, // Only send password if changed
                    role: { 
                        id: parseInt(data.roleId),
                        name: selectedRole ? selectedRole.name : ""
                    } 
                });
                alert("Cập nhật tài khoản thành công!");
            } else {
                // Create new account
                await accountApi.createAccount({
                    username: data.username,
                    password: data.password,
                    roleId: parseInt(data.roleId), 
                });
                alert("Tạo tài khoản thành công!");
            }
            onClose(); // Close the form after successful submission
        } catch (error) {
            console.error("Lỗi khi lưu tài khoản:", error);
            alert("Lưu tài khoản thất bại.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(100, 100, 100, 0.5)' }}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{account ? "Chỉnh sửa Tài khoản" : "Thêm Tài khoản mới"}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input
                            type="text"
                            {...register("username", { required: "Vui lòng nhập tên đăng nhập" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            {...register("password", { required: account ? false : "Vui lòng nhập mật khẩu" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                        <select
                            {...register("roleId", { required: "Vui lòng chọn vai trò" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="">-- Chọn vai trò --</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id.toString()}>{role.name}</option>
                            ))}
                        </select>
                        {errors.roleId && <p className="text-red-500 text-xs mt-1">{errors.roleId.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#40ACE9] text-white rounded-md hover:bg-blue-600"
                        >
                            {account ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AccountForm; 