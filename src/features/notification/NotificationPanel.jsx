import React, { useEffect, useState } from 'react';

function NotificationPanel() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Mock API call to fetch notifications
        const mockNotifications = [
            {
                id: 1,
                title: 'Chấm điểm rèn luyện học kỳ 1 2024-2025',
                content: 'Kế hoạch',
                date: '2023-12-01 14:07',
                new: true,
            },
            {
                id: 2,
                title: 'V/v tổ chức kỳ thi Tiếng Anh chuẩn đầu ra',
                content: 'Thông báo chi tiết',
                date: '2025-06-04 09:00',
                new: true,
            },
        ];
        setNotifications(mockNotifications);
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center">
                <span className="mr-2">📢</span> THÔNG BÁO
            </h2>
            <ul className="space-y-2">
                {notifications.map((noti) => (
                    <li key={noti.id} className={`p-2 border rounded ${noti.new ? 'bg-yellow-100' : 'bg-white'}`}>
                        <a href="#" className="text-blue-500 hover:underline">{noti.title}</a>
                        <span className="text-gray-500 text-sm ml-2">{noti.date}</span>
                        {noti.new && <span className="text-red-500 ml-2">New</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotificationPanel;