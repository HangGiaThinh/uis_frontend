import React, { useEffect, useState } from "react";
import accountApi from "../../services/account/accountApi";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import AccountForm from "../../components/account/AccountForm";

function AccountManagementPage() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await accountApi.getAccounts();
            setAccounts(data);
            setError(null);
        } catch (err) {
            setError(err);
            console.error("Lỗi khi tải danh sách tài khoản:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleCreateNew = () => {
        setSelectedAccount(null); // Clear selected account for create operation
        setIsFormOpen(true);
    };

    const handleEdit = (account) => {
        setSelectedAccount(account);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
            try {
                await accountApi.deleteAccount(id);
                fetchAccounts(); // Refresh the list after deletion
                alert("Xóa tài khoản thành công!");
            } catch (err) {
                console.error("Lỗi khi xóa tài khoản:", err);
                alert("Xóa tài khoản thất bại.");
            }
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedAccount(null);
        fetchAccounts(); // Refresh the list after form submission
    };

    if (loading) {
        return <div>Đang tải tài khoản...</div>;
    }

    if (error) {
        return <div className="text-red-500">Có lỗi xảy ra khi tải danh sách tài khoản. Vui lòng thử lại sau.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý Tài khoản</h1>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group"
                >
                    <PlusCircle className="w-4 h-4 group-hover:text-white" />
                    <span>Thêm tài khoản mới</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {accounts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#40ACE9] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên đăng nhập</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Vai trò</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {accounts.map(account => (
                                    <tr key={account.userId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.userId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.accountRole?.roleName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(account)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <Pencil className="w-5 h-5 inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(account.userId)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-5 h-5 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Không có tài khoản nào để hiển thị.</p>
                )}
            </div>

            {isFormOpen && (
                <AccountForm
                    account={selectedAccount}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}

export default AccountManagementPage; 