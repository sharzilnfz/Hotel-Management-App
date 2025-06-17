import HallBooking from '../../models/meeting-hall/hall-booking.model.js';
import MeetingHall from '../../models/meeting-hall/meeting-hall.model.js';

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const { status, hallId, startDate, endDate } = req.query;
        let query = {};

        // Apply filters if provided
        if (status) {
            query.status = status;
        }

        if (hallId) {
            query.hallId = hallId;
        }

        // Date range filter
        if (startDate || endDate) {
            query.startDate = {};

            if (startDate) {
                query.startDate.$gte = new Date(startDate);
            }

            if (endDate) {
                query.endDate = {};
                query.endDate.$lte = new Date(endDate);
            }
        }

        const bookings = await HallBooking.find(query)
            .sort({ startDate: -1 })
            .populate('hallId', 'name capacity');

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (error) {
        console.error('Error getting bookings:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single booking
export const getBooking = async (req, res) => {
    try {
        const booking = await HallBooking.findById(req.params.id)
            .populate('hallId', 'name capacity size price amenities');

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (error) {
        console.error('Error getting booking:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        // Check if the hall exists and is available
        const hall = await MeetingHall.findById(req.body.hallId);

        if (!hall) {
            return res.status(404).json({
                status: 'error',
                message: 'Meeting hall not found'
            });
        }

        if (hall.status === 'Maintenance') {
            return res.status(400).json({
                status: 'error',
                message: 'The selected hall is under maintenance and not available for booking'
            });
        }

        // Check if there are any overlapping bookings
        const { startDate, endDate, hallId } = req.body;
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        const overlappingBookings = await HallBooking.find({
            hallId,
            status: { $ne: 'Cancelled' },
            $or: [
                // New booking starts during an existing booking
                {
                    startDate: { $lte: startDateTime },
                    endDate: { $gte: startDateTime }
                },
                // New booking ends during an existing booking
                {
                    startDate: { $lte: endDateTime },
                    endDate: { $gte: endDateTime }
                },
                // New booking completely overlaps an existing booking
                {
                    startDate: { $gte: startDateTime },
                    endDate: { $lte: endDateTime }
                }
            ]
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'The hall is already booked during the selected time period'
            });
        }

        // Add hall name from the hall object
        req.body.hallName = hall.name;

        // Create the booking
        const newBooking = await HallBooking.create(req.body);

        // If booking is confirmed, update hall status
        if (newBooking.status === 'Confirmed') {
            await MeetingHall.findByIdAndUpdate(hallId, { status: 'Booked' });
        }

        res.status(201).json({
            status: 'success',
            data: {
                booking: newBooking
            }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a booking
export const updateBooking = async (req, res) => {
    try {
        const booking = await HallBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        // Check if dates are being updated
        if (req.body.startDate || req.body.endDate) {
            const startDate = req.body.startDate ? new Date(req.body.startDate) : booking.startDate;
            const endDate = req.body.endDate ? new Date(req.body.endDate) : booking.endDate;
            const hallId = req.body.hallId || booking.hallId;

            // Check for overlapping bookings
            const overlappingBookings = await HallBooking.find({
                _id: { $ne: booking._id }, // Exclude current booking
                hallId,
                status: { $ne: 'Cancelled' },
                $or: [
                    {
                        startDate: { $lte: startDate },
                        endDate: { $gte: startDate }
                    },
                    {
                        startDate: { $lte: endDate },
                        endDate: { $gte: endDate }
                    },
                    {
                        startDate: { $gte: startDate },
                        endDate: { $lte: endDate }
                    }
                ]
            });

            if (overlappingBookings.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'The hall is already booked during the selected time period'
                });
            }
        }

        // If hall is being changed, update hallName
        if (req.body.hallId && req.body.hallId !== booking.hallId.toString()) {
            const hall = await MeetingHall.findById(req.body.hallId);
            if (!hall) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Meeting hall not found'
                });
            }
            req.body.hallName = hall.name;
        }

        const updatedBooking = await HallBooking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('hallId', 'name capacity size price amenities');

        // Handle status changes
        if (req.body.status) {
            // If status is changed to Confirmed, update hall status
            if (req.body.status === 'Confirmed' && booking.status !== 'Confirmed') {
                await MeetingHall.findByIdAndUpdate(updatedBooking.hallId, { status: 'Booked' });
            }

            // If status is changed to Cancelled, update hall status back to available
            if (req.body.status === 'Cancelled' && booking.status !== 'Cancelled') {
                await MeetingHall.findByIdAndUpdate(updatedBooking.hallId, { status: 'Available' });
            }
        }

        res.status(200).json({
            status: 'success',
            data: {
                booking: updatedBooking
            }
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
    try {
        const booking = await HallBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        await HallBooking.findByIdAndDelete(req.params.id);

        // If the booking was confirmed, update the hall status back to available
        if (booking.status === 'Confirmed') {
            await MeetingHall.findByIdAndUpdate(booking.hallId, { status: 'Available' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}; 