import { useState, useEffect } from 'react';
import { notificationApi } from '../../api/notificationApi';
import useAuth from '../../hooks/useAuth';

const useNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (token) {
                try {
                    const response = await notificationApi.poll(token);
                    setNotifications(response.data.notifications);
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            }
        };

        const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [token]);

    return { notifications };
};

export default useNotification;