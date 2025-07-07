// backend/utils/notifications.js
import Notification from '../models/notification.schema';

const createNotification = async ({
  title,
  message,
  recipientId,
  recipientModel,
}) => {
  try {
    const notification = await Notification.create({
      title,
      message,
      recipientId,
      recipientModel,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export default createNotification;