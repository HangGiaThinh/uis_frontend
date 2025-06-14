import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    setIsSuccess(false);
    try {
      const response = await api.post('/v1/auth/forgot-password', { email: data.email });
      setMessage(response.data.message);
      setIsSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage(error.response?.data?.response_message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#40ACE9]">Quên Mật Khẩu</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email không được để trống",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Địa chỉ email không hợp lệ",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#40ACE9] focus:border-[#40ACE9]"
              placeholder="Nhập email của bạn"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#40ACE9] hover:bg-[#2696c8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40ACE9]"
          >
            {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu Đặt Lại Mật Khẩu'}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/" className="text-[#40ACE9] hover:underline">Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage; 