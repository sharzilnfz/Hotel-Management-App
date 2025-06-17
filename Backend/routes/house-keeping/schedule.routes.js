import express from 'express';
import {
    getAllSchedules,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByDate
} from '../../controllers/house-keeping/schedule.controller.js';

const router = express.Router();

// Get all schedules and create a new schedule
router.route('/')
    .get(getAllSchedules)
    .post(createSchedule);

// Get, update, and delete a specific schedule
router.route('/:id')
    .get(getSchedule)
    .put(updateSchedule)
    .delete(deleteSchedule);

// Get schedules for a specific date
router.route('/date/:date')
    .get(getSchedulesByDate);

export default router; 