import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, FileText } from "lucide-react";
import announcementApi from "../../services/announcement/announcementApi";

function CreateAnnouncementForm({ onClose }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const editorRef = useRef(null);
    const isInitializedRef = useRef(false);
    const editorIdRef = useRef(`announcement-editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        // Ngăn chặn việc khởi tạo nhiều lần
        if (isInitializedRef.current) {
            return;
        }

        const initializeEditor = () => {
            if (!window.CKEDITOR) {
                console.warn('CKEditor not loaded');
                return;
            }

            const editorId = editorIdRef.current;
            const element = document.getElementById(editorId);
            
            if (!element) {
                console.warn('Editor element not found');
                return;
            }

            // Đảm bảo không có instance nào tồn tại
            if (CKEDITOR.instances[editorId]) {
                try {
                    CKEDITOR.instances[editorId].destroy(true);
                    delete CKEDITOR.instances[editorId];
                } catch (error) {
                    console.error('Error destroying existing editor:', error);
                }
            }

            // Đợi một chút để đảm bảo cleanup hoàn tất
            setTimeout(() => {
                try {
                    // Kiểm tra lại element và instance
                    if (!document.getElementById(editorId) || CKEDITOR.instances[editorId]) {
                        return;
                    }

                    const editor = CKEDITOR.replace(editorId, {
                        height: 250,
                        versionCheck: false,
                        extraPlugins: 'uploadimage',
                        removePlugins: 'export,exportpdf',
                        language: 'vi',
                        allowedContent: true,
                        toolbar: [
                            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
                            { name: 'insert', items: ['Link', 'Unlink'] },
                            { name: 'styles', items: ['Format'] },
                            { name: 'tools', items: ['Maximize'] }
                        ]
                    });

                    if (editor) {
                        editorRef.current = editor;
                        isInitializedRef.current = true;
                        console.log('CKEditor initialized successfully');
                    }
                } catch (error) {
                    console.error('Error initializing CKEditor:', error);
                }
            }, 300);
        };

        // Delay khởi tạo để đảm bảo DOM ready
        const timer = setTimeout(initializeEditor, 100);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            isInitializedRef.current = false;
            
            if (editorRef.current) {
                try {
                    editorRef.current.destroy(true);
                    editorRef.current = null;
                } catch (error) {
                    console.error('Error destroying CKEditor:', error);
                }
            }

            // Force cleanup all instances
            if (window.CKEDITOR) {
                const editorId = editorIdRef.current;
                if (CKEDITOR.instances[editorId]) {
                    try {
                        CKEDITOR.instances[editorId].destroy(true);
                        delete CKEDITOR.instances[editorId];
                    } catch (error) {
                        console.error('Error force destroying editor:', error);
                    }
                }
            }
        };
    }, []);

    const handleAttachmentChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachmentFile(e.target.files[0]);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            
            // Lấy nội dung từ CKEditor
            let content = data.content;
            if (editorRef.current) {
                content = editorRef.current.getData();
            }
            
            // Validate content không rỗng
            if (!content || content.trim() === '') {
                alert('Vui lòng nhập nội dung thông báo');
                return;
            }

            const announcementData = {
                title: data.title,
                content: content,
            };
            
            await announcementApi.createAnnouncement(announcementData, attachmentFile);
            alert("Tạo thông báo thành công!");
            onClose();
        } catch (error) {
            console.error("Lỗi khi tạo thông báo:", error);
            alert("Tạo thông báo thất bại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="px-8 py-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </span>
                                Tạo thông báo mới
                            </h2>
                            <p className="text-gray-600 mt-2">Điền thông tin để tạo thông báo mới cho sinh viên</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                    <div className="space-y-2">
                        <label className="block text-base font-semibold text-gray-800 mb-3">
                            Tiêu đề thông báo
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                {...register("title", { 
                                    required: "Vui lòng nhập tiêu đề thông báo",
                                    minLength: {
                                        value: 10,
                                        message: "Tiêu đề phải có ít nhất 10 ký tự"
                                    },
                                    maxLength: {
                                        value: 200,
                                        message: "Tiêu đề không được vượt quá 200 ký tự"
                                    }
                                })}
                                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                                placeholder="Nhập tiêu đề thông báo..."
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                        </div>
                        {errors.title && (
                            <div className="flex items-center mt-2 text-red-600">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">{errors.title.message}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-semibold text-gray-800 mb-3">
                            Nội dung thông báo
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition-colors duration-200">
                            <textarea
                                id={editorIdRef.current}
                                name="content"
                                rows="6"
                                className="w-full px-4 py-3 border-0 rounded-lg focus:ring-0 focus:outline-none resize-none"
                                placeholder="Nhập nội dung thông báo chi tiết..."
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Mô tả chi tiết nội dung thông báo để sinh viên dễ hiểu
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-semibold text-gray-800 mb-3">
                            Đính kèm tài liệu
                            <span className="text-gray-500 text-sm font-normal ml-1">(Tùy chọn)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleAttachmentChange}
                                className="hidden"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 font-medium">
                                        Chọn tệp để đính kèm
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (Tối đa 10MB)
                                    </p>
                                </div>
                            </label>
                            {attachmentFile && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center">
                                        <FileText className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-sm text-gray-700 font-medium">{attachmentFile.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setAttachmentFile(null)}
                                            className="ml-auto text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
                        >
                            <X className="w-4 h-4" />
                            <span>Hủy bỏ</span>
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center px-4 py-2 border border-[#40ACE9] text-[#40ACE9] font-semibold rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Đang tạo...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>Tạo thông báo</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAnnouncementForm; 