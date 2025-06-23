import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createComplaint } from '../../services/complaint/complaintService';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function CreateComplaintForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const editorRef = useRef(null);
    const isInitializedRef = useRef(false);
    const editorIdRef = useRef(`content-editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    const mutation = useMutation({
        mutationFn: createComplaint,
        onSuccess: () => {
            alert('Gửi khiếu nại thành công!');
            navigate('/complaints');
        },
        onError: (error) => alert('Lỗi khi gửi khiếu nại: ' + error.message),
    });

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
                        height: 300,
                        versionCheck: false,
                        extraPlugins: 'uploadimage',
                        removePlugins: 'export,exportpdf',
                        language: 'vi',
                        allowedContent: true,
                        filebrowserUploadUrl: '/upload-endpoint',
                        toolbar: 'Full'
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

    const onSubmit = (data) => {
        // Lấy nội dung từ CKEditor
        if (editorRef.current) {
            const content = editorRef.current.getData();
            data.content = content;
        }
        
        // Validate content không rỗng
        if (!data.content || data.content.trim() === '') {
            alert('Vui lòng nhập nội dung khiếu nại');
            return;
        }
        
        mutation.mutate(data);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="px-8 py-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </span>
                        Tạo khiếu nại mới
                    </h2>
                    <p className="text-gray-600 mt-2">Vui lòng điền đầy đủ thông tin để gửi khiếu nại của bạn</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                    <div className="space-y-2">
                        <label className="block text-base font-semibold text-gray-800 mb-3">
                            Tiêu đề khiếu nại
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                {...register('title', { 
                                    required: 'Vui lòng nhập tiêu đề khiếu nại',
                                    minLength: {
                                        value: 10,
                                        message: 'Tiêu đề phải có ít nhất 10 ký tự'
                                    },
                                    maxLength: {
                                        value: 200,
                                        message: 'Tiêu đề không được vượt quá 200 ký tự'
                                    }
                                })}
                                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                                placeholder="Nhập tiêu đề khiếu nại của bạn..."
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
                            Nội dung khiếu nại
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition-colors duration-200">
                            <textarea
                                id={editorIdRef.current}
                                name="content"
                                rows="4"
                                className="w-full px-4 py-3 border-0 rounded-lg focus:ring-0 focus:outline-none resize-none"
                                placeholder="Mô tả chi tiết về vấn đề bạn muốn khiếu nại..."
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Hãy mô tả rõ ràng và chi tiết về vấn đề để chúng tôi có thể hỗ trợ bạn tốt nhất
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/complaints')}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Hủy bỏ</span>
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center px-4 py-2 border border-[#40ACE9] text-[#40ACE9] font-semibold rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Đang gửi...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>Gửi khiếu nại</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateComplaintForm; 