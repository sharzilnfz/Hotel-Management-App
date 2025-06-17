import MeetingHall from '../../models/meeting-hall/meeting-hall.model.js';

// Get all meeting halls
export const getAllMeetingHalls = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        const halls = await MeetingHall.find(query).sort({ name: 1 });

        res.status(200).json({
            status: 'success',
            results: halls.length,
            data: {
                halls
            }
        });
    } catch (error) {
        console.error('Error getting meeting halls:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single meeting hall
export const getMeetingHall = async (req, res) => {
    try {
        const hall = await MeetingHall.findById(req.params.id);

        if (!hall) {
            return res.status(404).json({
                status: 'error',
                message: 'Meeting hall not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                hall
            }
        });
    } catch (error) {
        console.error('Error getting meeting hall:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new meeting hall
export const createMeetingHall = async (req, res) => {
    try {
        const newHall = await MeetingHall.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                hall: newHall
            }
        });
    } catch (error) {
        console.error('Error creating meeting hall:', error);

        // Handle duplicate key error (name must be unique)
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'A meeting hall with this name already exists'
            });
        }

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a meeting hall
export const updateMeetingHall = async (req, res) => {
    try {
        const updatedHall = await MeetingHall.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedHall) {
            return res.status(404).json({
                status: 'error',
                message: 'Meeting hall not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                hall: updatedHall
            }
        });
    } catch (error) {
        console.error('Error updating meeting hall:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'A meeting hall with this name already exists'
            });
        }

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a meeting hall
export const deleteMeetingHall = async (req, res) => {
    try {
        const hall = await MeetingHall.findByIdAndDelete(req.params.id);

        if (!hall) {
            return res.status(404).json({
                status: 'error',
                message: 'Meeting hall not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        console.error('Error deleting meeting hall:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}; 