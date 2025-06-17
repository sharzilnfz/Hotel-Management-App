import mongoose from 'mongoose';

// Schema for notification settings
const notificationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['channel', 'type', 'report'],
    default: 'type'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Static method to toggle notification status
notificationSchema.statics.toggleNotification = async function(notificationKey, status) {
  // Find the notification, create if it doesn't exist
  const notification = await this.findOne({ key: notificationKey });
  
  if (notification) {
    // If status is explicitly provided, use it, otherwise toggle
    notification.enabled = status !== undefined ? status : !notification.enabled;
    notification.updatedAt = new Date();
    await notification.save();
    return notification;
  } else {
    // Create new notification with the specified status
    return await this.create({ 
      key: notificationKey, 
      enabled: status !== undefined ? status : true,
      category: getCategoryFromKey(notificationKey)
    });
  }
};

// Static method to get all notifications (or initialize with defaults)
notificationSchema.statics.getAllNotifications = async function() {
  let notifications = await this.find();
  
  // If no notifications, initialize with defaults
  if (notifications.length === 0) {
    const defaultNotifications = [
      { key: 'emailNotifications', enabled: true, category: 'channel' },
      { key: 'smsNotifications', enabled: false, category: 'channel' },
      { key: 'bookingConfirmations', enabled: true, category: 'type' },
      { key: 'cancellationAlerts', enabled: true, category: 'type' },
      { key: 'lowInventoryAlerts', enabled: true, category: 'type' },
      { key: 'dailyReports', enabled: true, category: 'report' },
      { key: 'weeklyReports', enabled: true, category: 'report' },
      { key: 'monthlyReports', enabled: true, category: 'report' }
    ];
    
    await this.insertMany(defaultNotifications);
    notifications = await this.find();
  }
  
  return notifications;
};

// Static method to get notifications by category
notificationSchema.statics.getNotificationsByCategory = async function(category) {
  return await this.find({ category });
};

// Helper function to determine category from notification key
function getCategoryFromKey(key) {
  if (key.endsWith('Reports')) {
    return 'report';
  } else if (key.endsWith('Notifications')) {
    return 'channel';
  } else {
    return 'type';
  }
}

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
