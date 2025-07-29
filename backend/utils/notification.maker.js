// backend/utils/notifications.js
import Notification from '../models/notification.schema.js';

  
 async function generateNotification(title, message, recipientId, recipientModel) {
    const notification = new Notification({ title, message, recipientId, recipientModel });
    
    await notification.save();
    return notification;
  }

  export default generateNotification