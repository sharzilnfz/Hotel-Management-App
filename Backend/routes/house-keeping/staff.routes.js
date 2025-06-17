import express from 'express';
import {
    getAllStaff,
    getStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    uploadStaffPhoto,
    updatePerformance,
    updateTaskCounts
} from '../../controllers/house-keeping/staff.controller.js';

const router = express.Router();

// Get all staff and create a new staff member
router.route('/')
    .get(getAllStaff)
    .post(uploadStaffPhoto, createStaff);

// Get, update, and delete a specific staff member
router.route('/:id')
    .get(getStaff)
    .patch(uploadStaffPhoto, updateStaff)
    .delete(deleteStaff);

// Special routes for specific operations
router.route('/:id/performance')
    .patch(updatePerformance);

router.route('/:id/tasks')
    .patch(updateTaskCounts);

export default router; 