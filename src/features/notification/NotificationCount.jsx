import React, { useEffect, useState } from 'react';

function NotificationCount() {
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        // Mock API call to fetch notification count
        const mockNotifications = [
            { id: 1, new: true },
            { id: 2, new: true },
        ];
        const count = mockNotifications.filter((noti) => noti.new).length;
        setNotificationCount(count);
    }, []);

    return (
        <div className="mb-6 p-4 bg-blue-100 rounded flex items-center space-x-2">
            <span className="text-blue-500">📢</span>
            <span className="font-bold">Thông báo mới:</span>
            <span className="text-red-500 font-bold">{notificationCount}</span>
        </div>
    );
}

export default NotificationCount;