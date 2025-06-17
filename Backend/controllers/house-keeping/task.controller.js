import HouseKeepingTask from '../../models/house-keeping/task.model.js';
import HouseKeepingStaff from '../../models/house-keeping/staff.model.js';

// Get all tasks with filters
export const getAllTasks = async (req, res) => {
    try {
        const { status, priority, roomNumber, assignedTo, isRecurring } = req.query;
        const queryObj = {};

        // Apply filters if provided
        if (status) queryObj.status = status;
        if (priority) queryObj.priority = priority;
        if (roomNumber) queryObj.roomNumber = roomNumber;
        if (assignedTo) queryObj.assignedTo = assignedTo;
        if (isRecurring !== undefined) queryObj.isRecurring = isRecurring === 'true';

        console.log('Query filters:', queryObj);

        // Find tasks and populate staff info
        const tasks = await HouseKeepingTask.find(queryObj)
            .populate('assignedTo', 'name email position')
            .sort({ dueDate: 1 }); // Sort by due date ascending

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: {
                tasks
            }
        });
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single task
export const getTask = async (req, res) => {
    try {
        const task = await HouseKeepingTask.findById(req.params.id)
            .populate('assignedTo', 'name email position');

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error getting task:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new task
export const createTask = async (req, res) => {
    try {
        console.log('Create task request received:', req.body);

        // Verify that the assigned staff exists
        const staffExists = await HouseKeepingStaff.exists({ _id: req.body.assignedTo });
        if (!staffExists) {
            return res.status(400).json({
                status: 'error',
                message: 'Assigned staff member does not exist'
            });
        }

        const newTask = await HouseKeepingTask.create(req.body);

        // Populate the staff info for the response
        const populatedTask = await HouseKeepingTask.findById(newTask._id)
            .populate('assignedTo', 'name email position');

        // Increment the tasksAssigned counter for the staff member
        await HouseKeepingStaff.findByIdAndUpdate(
            req.body.assignedTo,
            { $inc: { tasksAssigned: 1, tasksInProgress: 1 } }
        );

        console.log('New task created:', populatedTask);

        res.status(201).json({
            status: 'success',
            data: {
                task: populatedTask
            }
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        console.log('Update task request received:', req.params.id, req.body);

        // Find the existing task
        const existingTask = await HouseKeepingTask.findById(req.params.id);
        if (!existingTask) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        // Check if assignedTo is being changed
        if (req.body.assignedTo && req.body.assignedTo !== existingTask.assignedTo.toString()) {
            // Decrement counter for previous staff
            await HouseKeepingStaff.findByIdAndUpdate(
                existingTask.assignedTo,
                { $inc: { tasksAssigned: -1 } }
            );

            // Increment counter for new staff
            await HouseKeepingStaff.findByIdAndUpdate(
                req.body.assignedTo,
                { $inc: { tasksAssigned: 1 } }
            );
        }

        // Check if status is being changed to completed
        if (req.body.status === 'completed' && existingTask.status !== 'completed') {
            // Update staff metrics
            await HouseKeepingStaff.findByIdAndUpdate(
                existingTask.assignedTo,
                {
                    $inc: {
                        tasksDone: 1,
                        tasksInProgress: -1
                    }
                }
            );
        }

        // Check if status is being changed from completed to something else
        if (existingTask.status === 'completed' && req.body.status && req.body.status !== 'completed') {
            // Revert staff metrics
            await HouseKeepingStaff.findByIdAndUpdate(
                existingTask.assignedTo,
                {
                    $inc: {
                        tasksDone: -1,
                        tasksInProgress: 1
                    }
                }
            );
        }

        // Check if status is changing to in-progress 
        if (req.body.status === 'in-progress' && existingTask.status === 'pending') {
            // No need to update counters as the task is already included in tasksInProgress
        }

        // Update the task
        const updatedTask = await HouseKeepingTask.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email position');

        console.log('Task updated:', updatedTask);

        res.status(200).json({
            status: 'success',
            data: {
                task: updatedTask
            }
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        // Find the task first to get the assignedTo field
        const task = await HouseKeepingTask.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        // Delete the task
        await HouseKeepingTask.findByIdAndDelete(req.params.id);

        // Update staff metrics
        await HouseKeepingStaff.findByIdAndUpdate(
            task.assignedTo,
            {
                $inc: {
                    tasksAssigned: -1,
                    tasksInProgress: task.status !== 'completed' ? -1 : 0,
                    tasksDone: task.status === 'completed' ? -1 : 0
                }
            }
        );

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get task counts by status
export const getTaskCounts = async (req, res) => {
    try {
        const counts = await HouseKeepingTask.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert to object format
        const result = {
            pending: 0,
            'in-progress': 0,
            completed: 0,
            delayed: 0
        };

        counts.forEach(item => {
            result[item._id] = item.count;
        });

        // Add total count
        result.total = Object.values(result).reduce((acc, val) => acc + val, 0);

        res.status(200).json({
            status: 'success',
            data: {
                counts: result
            }
        });
    } catch (error) {
        console.error('Error getting task counts:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}; 