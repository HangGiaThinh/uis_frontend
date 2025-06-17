import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import announcementApi from "../../services/announcement/announcementApi";

function CreateAnnouncementForm({ onClose }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [attachmentFile, setAttachmentFile] = useState(null);

    const handleAttachmentChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachmentFile(e.target.files[0]);
        }
    };

    const onSubmit = async (data) => {
        try {
            const announcementData = {
                title: data.title,
                content: data.content,
            };
            await announcementApi.createAnnouncement(announcementData, attachmentFile);
            alert("Tạo thông báo thành công!");
            onClose(); // Close the form after successful submission
        } catch (error) {
            console.error("Lỗi khi tạo thông báo:", error);
            alert("Tạo thông báo thất bại.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(100, 100, 100, 0.5)' }}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Tạo Thông báo mới</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                        <input
                            type="text"
                            {...register("title", { required: "Vui lòng nhập tiêu đề" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                        <textarea
                            {...register("content", { required: "Vui lòng nhập nội dung" })}
                            rows="5"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        ></textarea>
                        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Đính kèm (tùy chọn)</label>
                        <input
                            type="file"
                            onChange={handleAttachmentChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#40ACE9] hover:file:bg-blue-100"
                        />
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
                            Tạo Thông báo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAnnouncementForm; 