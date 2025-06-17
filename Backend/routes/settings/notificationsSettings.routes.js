import express from 'express';
import { getAllNotifications, toggleNotification, updateNotifications } from '../../controllers/settings/notificationsSettings.controller.js';

const router = express.Router();

// Get all notifications
router.get('/', getAllNotifications);

// Update multiple notifications 
router.put('/', updateNotifications);

// Toggle single notification
router.patch('/toggle/:notificationKey', toggleNotification);

export default router;
