import express from 'express';
import * as taskController from '../../controllers/house-keeping/task.controller.js';

const router = express.Router();

// Task management routes
router.route('/')
    .get(taskController.getAllTasks)
    .post(taskController.createTask);

router.route('/counts')
    .get(taskController.getTaskCounts);

router.route('/:id')
    .get(taskController.getTask)
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask);

export default router; 