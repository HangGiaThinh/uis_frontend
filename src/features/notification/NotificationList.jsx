import React from 'react'

function NotificationList() {
    const notifications = [
        { id: 1, title: 'Thông báo lịch học kỳ 2024-2025', date: '26/05/2025 14:27' },
        { id: 2, title: 'Thông báo kỳ thi giữa kỳ', date: '25/05/2025 14:25' },
        // Thêm các thông báo khác từ mockData nếu cần
    ]

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-red-600 flex items-center">
                <span className="text-4xl mr-2">📢</span> THÔNG BÁO
            </h1>
            <ul className="space-y-2">
                {notifications.map((noti) => (
                    <li key={noti.id} className="border-b pb-2">
                        <span>{noti.title}</span>
                        <span className="text-gray-500 text-sm float-right">{noti.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default NotificationList