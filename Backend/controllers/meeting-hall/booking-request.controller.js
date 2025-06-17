import BookingRequest from '../../models/meeting-hall/booking-request.model.js';

// Get all booking requests
export const getAllBookingRequests = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        const requests = await BookingRequest.find(query).sort({ submissionDate: -1 });

        res.status(200).json({
            status: 'success',
            results: requests.length,
            data: {
                requests
            }
        });
    } catch (error) {
        console.error('Error getting booking requests:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single booking request
export const getBookingRequest = async (req, res) => {
    try {
        const request = await BookingRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking request not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                request
            }
        });
    } catch (error) {
        console.error('Error getting booking request:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new booking request
export const createBookingRequest = async (req, res) => {
    try {
        const newRequest = await BookingRequest.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                request: newRequest
            }
        });
    } catch (error) {
        console.error('Error creating booking request:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a booking request
export const updateBookingRequest = async (req, res) => {
    try {
        // Mark as viewed if status is being changed from 'New'
        if (req.body.status && req.body.status !== 'New') {
            req.body.isNew = false;
        }

        const updatedRequest = await BookingRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking request not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                request: updatedRequest
            }
        });
    } catch (error) {
        console.error('Error updating booking request:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a booking request
export const deleteBookingRequest = async (req, res) => {
    try {
        const request = await BookingRequest.findByIdAndDelete(req.params.id);

        if (!request) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking request not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        console.error('Error deleting booking request:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Mark booking request as read
export const markAsRead = async (req, res) => {
    try {
        const updatedRequest = await BookingRequest.findByIdAndUpdate(
            req.params.id,
            { isNew: false },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking request not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                request: updatedRequest
            }
        });
    } catch (error) {
        console.error('Error marking booking request as read:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get count of new booking requests
export const getNewRequestsCount = async (req, res) => {
    try {
        const count = await BookingRequest.countDocuments({ isNew: true });

        res.status(200).json({
            status: 'success',
            data: {
                count
            }
        });
    } catch (error) {
        console.error('Error counting new booking requests:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}; 