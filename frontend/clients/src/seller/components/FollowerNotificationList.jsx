import React from 'react';

const FollowerNotificationList = () => {
    const notifications = [
        { id: 1, message: 'John Doe started following you.' },
        { id: 2, message: 'Jane Doe started following you.' },
    ];

    return (
        <div>
            <h1>Follower Notifications</h1>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default FollowerNotificationList;