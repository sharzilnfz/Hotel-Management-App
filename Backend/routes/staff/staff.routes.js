import express from 'express';
import * as staffController from '../../controllers/staff/staff.controller.js';

const router = express.Router();

// Routes without auth middleware
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaff);
router.post('/', staffController.createStaff);
router.patch('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

export default router; 