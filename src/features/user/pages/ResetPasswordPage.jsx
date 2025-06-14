import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const newPassword = watch("new_password");

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Token đặt lại mật khẩu không hợp lệ hoặc không có.');
      setIsSuccess(false);
    }
  }, [token]);

  const onSubmit = async (data) => {
    if (!token) {
      setMessage('Token đặt lại mật khẩu không hợp lệ hoặc không có.');
      setIsSuccess(false);
      return;
    }

    if (data.new_password !== data.confirm_password) {
      setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsSuccess(false);
    try {
      const response = await api.post('/v1/auth/reset-password', { 
        token: token, 
        new_password: data.new_password, 
        confirm_password: data.confirm_password 
      });
      setMessage(response.data.message);
      setIsSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage(error.response?.data?.response_message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#40ACE9]">Đặt Lại Mật Khẩu</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <input
              type="password"
              id="new_password"
              {...register("new_password", { 
                required: "Mật khẩu mới không được để trống",
                minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#40ACE9] focus:border-[#40ACE9]"
            />
            {errors.new_password && <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              id="confirm_password"
              {...register("confirm_password", {
                required: "Xác nhận mật khẩu không được để trống",
                validate: value => value === newPassword || "Mật khẩu xác nhận không khớp"
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#40ACE9] focus:border-[#40ACE9]"
            />
            {errors.confirm_password && <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>}
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#40ACE9] hover:bg-[#2696c8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40ACE9]"
          >
            {loading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu'}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/" className="text-[#40ACE9] hover:underline">Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage; 