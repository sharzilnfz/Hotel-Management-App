import express from 'express';
import {
    getAllServices,
    getAllAvailabilities,
    getAvailabilityByMonth,
    updateAvailability,
    bulkUpdateAvailability,
    blockDay
} from '../../controllers/availability/availability.controller.js';
import { verifyToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all availabilities across all service types (NEW ROUTE)
router.get('/all', getAllAvailabilities);

// Get all services by type
router.get('/services/:serviceType', getAllServices);

// Get availability for a service by month
router.get('/:serviceType/:serviceId', getAvailabilityByMonth);

// Update availability for a specific date
router.put('/:serviceType/:serviceId', updateAvailability);

// Bulk update availability
router.put('/:serviceType/:serviceId/bulk', bulkUpdateAvailability);

// Block an entire day
router.put('/:serviceType/:serviceId/block', blockDay);

export default router; 