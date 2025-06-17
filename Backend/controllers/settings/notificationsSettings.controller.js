import Notification from '../../models/settings/notificationsSettings.model.js';

/**
 * Get all notifications with their status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with notifications
 */
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAllNotifications();
    
    // Convert to object with notification key as key and enabled status as value
    const notificationsObj = {};
    notifications.forEach(notification => {
      notificationsObj[notification.key] = notification.enabled;
    });
    
    return res.status(200).json({
      success: true,
      data: {
        notifications: notificationsObj
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

/**
 * Toggle a notification's enabled status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated notification
 */
export const toggleNotification = async (req, res) => {
  try {
    const { notificationKey } = req.params;
    
    // Toggle the notification (or create if it doesn't exist)
    const notification = await Notification.toggleNotification(notificationKey);
    
    // Get all notifications to return the complete list
    const notifications = await Notification.getAllNotifications();
    const notificationsObj = {};
    notifications.forEach(notif => {
      notificationsObj[notif.key] = notif.enabled;
    });
    
    return res.status(200).json({
      success: true,
      message: `Notification ${notificationKey} has been ${notification.enabled ? 'enabled' : 'disabled'}`,
      data: {
        notifications: notificationsObj
      }
    });
  } catch (error) {
    console.error('Error toggling notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle notification',
      error: error.message
    });
  }
};

/**
 * Update multiple notifications at once
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated notifications
 */
export const updateNotifications = async (req, res) => {
  try {
    const { notifications } = req.body;
    
    if (!notifications || typeof notifications !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notifications data'
      });
    }
    
    // Update each notification
    const updatePromises = Object.entries(notifications).map(([key, enabled]) => 
      Notification.toggleNotification(key, Boolean(enabled))
    );
    
    await Promise.all(updatePromises);
    
    // Get all notifications after update
    const notificationsFromDb = await Notification.getAllNotifications();
    const notificationsObj = {};
    notificationsFromDb.forEach(notification => {
      notificationsObj[notification.key] = notification.enabled;
    });
    
    return res.status(200).json({
      success: true,
      message: 'Notifications updated successfully',
      data: {
        notifications: notificationsObj
      }
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
      error: error.message
    });
  }
};
