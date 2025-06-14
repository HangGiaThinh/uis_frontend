// src/features/student/components/profile/StudentProfileUpdateForm.jsx
import React, { useEffect, useState } from "react";
import profileApi from "../../services/profile/profileApi";

function StudentProfileUpdateForm() {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await profileApi.getProfile();
                setFormData(res.data);
                setLoading(false);
            } catch (error) {
                setMessage("Không thể tải thông tin sinh viên.");
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = type === "checkbox" ? e.target.checked : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await profileApi.updateProfile(formData);
            setMessage("✅ Cập nhật thành công!");
        } catch (error) {
            setMessage("❌ Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    if (loading) return <p>Đang tải thông tin sinh viên...</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-4 mt-6"
        >
            <h2 className="text-xl font-semibold mb-2">Cập nhật thông tin</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Mã số sinh viên</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId || ""}
                        disabled
                        className="w-full border p-2 rounded bg-gray-100"
                    />
                </div>

                <div>
                    <label>Họ</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label>Tên</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label>Ngày sinh</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label>Giới tính</label>
                    <select
                        name="gender"
                        value={formData.gender ? "true" : "false"}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                gender: e.target.value === "true",
                            }))
                        }
                        className="w-full border p-2 rounded"
                    >
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                    </select>
                </div>

                <div>
                    <label>Số điện thoại</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label>CMND/CCCD</label>
                    <input
                        type="text"
                        name="citizenId"
                        value={formData.citizenId || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label>Email trường</label>
                    <input
                        type="email"
                        name="universityEmail"
                        value={formData.universityEmail || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label>Email cá nhân</label>
                    <input
                        type="email"
                        name="personalEmail"
                        value={formData.personalEmail || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
            </div>

            {message && (
                <p className="text-sm text-blue-600 font-medium mt-2">{message}</p>
            )}

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Lưu thay đổi
            </button>
        </form>
    );
}

export default StudentProfileUpdateForm;
