import HouseKeepingSchedule from '../../models/house-keeping/schedule.model.js';
import { format, parseISO } from 'date-fns';

// Get all schedules with optional date range filtering
export const getAllSchedules = async (req, res) => {
    try {
        const { startDate, endDate, staffId } = req.query;
        let query = {};

        // Filter by date range if provided
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            query.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.date = { $lte: new Date(endDate) };
        }

        // Filter by staff if provided
        if (staffId) {
            query.staffId = staffId;
        }

        const schedules = await HouseKeepingSchedule.find(query).sort({ date: 1 });

        // Format dates to match frontend format
        const formattedSchedules = schedules.map(schedule => {
            const formattedSchedule = schedule.toObject();
            formattedSchedule.date = format(schedule.date, 'yyyy-MM-dd');
            return formattedSchedule;
        });

        res.status(200).json({
            status: 'success',
            results: formattedSchedules.length,
            data: {
                schedules: formattedSchedules
            }
        });
    } catch (error) {
        console.error('Error getting schedules:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single schedule
export const getSchedule = async (req, res) => {
    try {
        const schedule = await HouseKeepingSchedule.findById(req.params.id);

        if (!schedule) {
            return res.status(404).json({
                status: 'error',
                message: 'Schedule not found'
            });
        }

        // Format date
        const formattedSchedule = schedule.toObject();
        formattedSchedule.date = format(schedule.date, 'yyyy-MM-dd');

        res.status(200).json({
            status: 'success',
            data: {
                schedule: formattedSchedule
            }
        });
    } catch (error) {
        console.error('Error getting schedule:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new schedule
export const createSchedule = async (req, res) => {
    try {
        console.log('Create schedule request received:', req.body);

        // Parse the date string to Date object if it's provided as a string
        if (req.body.date && typeof req.body.date === 'string') {
            req.body.date = parseISO(req.body.date);
        }

        const newSchedule = await HouseKeepingSchedule.create(req.body);

        // Format date for response
        const formattedSchedule = newSchedule.toObject();
        formattedSchedule.date = format(newSchedule.date, 'yyyy-MM-dd');

        console.log('New schedule created:', formattedSchedule);

        res.status(201).json({
            status: 'success',
            data: {
                schedule: formattedSchedule
            }
        });
    } catch (error) {
        console.error('Error creating schedule:', error);

        // Handle duplicate key error (staff already scheduled on this date)
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'This staff member already has a schedule for this date'
            });
        }

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a schedule
export const updateSchedule = async (req, res) => {
    try {
        console.log('Update schedule request received:', req.params.id, req.body);

        // Parse the date string to Date object if it's provided as a string
        if (req.body.date && typeof req.body.date === 'string') {
            req.body.date = parseISO(req.body.date);
        }

        const updatedSchedule = await HouseKeepingSchedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSchedule) {
            return res.status(404).json({
                status: 'error',
                message: 'Schedule not found'
            });
        }

        // Format date for response
        const formattedSchedule = updatedSchedule.toObject();
        formattedSchedule.date = format(updatedSchedule.date, 'yyyy-MM-dd');

        console.log('Schedule updated:', formattedSchedule);

        res.status(200).json({
            status: 'success',
            data: {
                schedule: formattedSchedule
            }
        });
    } catch (error) {
        console.error('Error updating schedule:', error);

        // Handle duplicate key error (staff already scheduled on this date)
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'This staff member already has a schedule for this date'
            });
        }

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
    try {
        const deletedSchedule = await HouseKeepingSchedule.findByIdAndDelete(req.params.id);

        if (!deletedSchedule) {
            return res.status(404).json({
                status: 'error',
                message: 'Schedule not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get schedules for a specific date
export const getSchedulesByDate = async (req, res) => {
    try {
        const { date } = req.params;

        const schedules = await HouseKeepingSchedule.find({
            date: {
                $gte: new Date(`${date}T00:00:00.000Z`),
                $lt: new Date(`${date}T23:59:59.999Z`)
            }
        });

        // Format dates for response
        const formattedSchedules = schedules.map(schedule => {
            const formattedSchedule = schedule.toObject();
            formattedSchedule.date = format(schedule.date, 'yyyy-MM-dd');
            return formattedSchedule;
        });

        res.status(200).json({
            status: 'success',
            results: formattedSchedules.length,
            data: {
                schedules: formattedSchedules
            }
        });
    } catch (error) {
        console.error('Error getting schedules by date:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}; 