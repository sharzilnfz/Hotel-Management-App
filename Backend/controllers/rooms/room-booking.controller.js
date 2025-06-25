import RoomBooking from '../../models/rooms/room-booking.model.js';
import Room from '../../models/rooms/room.model.js';
import {
  checkRoomAvailabilityForBooking,
  updateRoomAvailability,
} from '../../services/rooms/availability.service.js';

// Get all room bookings
export const getAllRoomBookings = async (req, res) => {
  try {
    const {
      status,
      roomId,
      checkInDate,
      checkOutDate,
      guestEmail,
      paymentStatus,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    let query = {};

    // Apply filters if provided
    if (status) {
      query.status = status;
    }

    if (roomId) {
      query.roomId = roomId;
    }

    if (guestEmail) {
      query['primaryGuest.email'] = { $regex: guestEmail, $options: 'i' };
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Date range filter
    if (checkInDate || checkOutDate) {
      query.checkInDate = {};

      if (checkInDate) {
        query.checkInDate.$gte = new Date(checkInDate);
      }

      if (checkOutDate) {
        query.checkInDate.$lte = new Date(checkOutDate);
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bookings = await RoomBooking.find(query)
      .populate('roomId', 'name type category price images')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalBookings = await RoomBooking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBookings,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error getting room bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room bookings',
      error: error.message,
    });
  }
};

// Get a single room booking by ID
export const getRoomBookingById = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id).populate(
      'roomId',
      'name type category price images amenities checkInTime checkOutTime'
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error getting room booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room booking',
      error: error.message,
    });
  }
};

// Get room booking by booking ID
export const getRoomBookingByBookingId = async (req, res) => {
  try {
    const booking = await RoomBooking.findOne({
      bookingId: req.params.bookingId,
    }).populate(
      'roomId',
      'name type category price images amenities checkInTime checkOutTime'
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error getting room booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room booking',
      error: error.message,
    });
  }
};

// Create a new room booking
export const createRoomBooking = async (req, res) => {
  try {
    const {
      roomId,
      primaryGuest,
      additionalGuests = [],
      checkInDate,
      checkOutDate,
      numberOfGuests,
      roomQuantity = 1,
      selectedExtras = [],
      discountApplied = {},
      paymentMethod,
      specialRequests = '',
      source = 'website',
    } = req.body;

    // Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check if room is active and published
    if (!room.active) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for booking',
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();

    if (checkIn < now) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past',
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    // Check room availability using the availability service
    const availabilityCheck = await checkRoomAvailabilityForBooking(
      roomId,
      checkIn,
      checkOut,
      roomQuantity
    );

    if (!availabilityCheck.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Not enough rooms available for the selected dates',
        availableRooms: availabilityCheck.availableRooms,
        requestedQuantity: roomQuantity,
      });
    }

    // Validate guest capacity
    if (numberOfGuests > room.capacity * roomQuantity) {
      return res.status(400).json({
        success: false,
        message: `Maximum capacity exceeded. This room type can accommodate up to ${
          room.capacity * roomQuantity
        } guests`,
      });
    }

    // Calculate pricing
    const diffTime = Math.abs(checkOut - checkIn);
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const basePrice = room.price * numberOfNights * roomQuantity;

    // Calculate extras total
    let extrasTotal = 0;
    selectedExtras.forEach((extra) => {
      extrasTotal += extra.price * (extra.quantity || 1);
    });

    // Calculate subtotal
    let subtotal = basePrice + extrasTotal;

    // Apply discount if provided
    let discountAmount = 0;
    if (discountApplied && discountApplied.value > 0) {
      if (discountApplied.type === 'percentage') {
        discountAmount = (subtotal * discountApplied.value) / 100;
      } else {
        discountAmount = discountApplied.value;
      }
    }

    // Calculate taxes (assuming 10% tax rate)
    const taxRate = 0.1;
    const taxableAmount = subtotal - discountAmount;
    const taxes = taxableAmount * taxRate;

    // Calculate total
    const totalAmount = taxableAmount + taxes;

    // Create booking data
    const bookingData = {
      roomId,
      roomName: room.name,
      roomType: room.type,
      primaryGuest,
      additionalGuests,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfNights,
      numberOfGuests,
      roomQuantity,
      basePrice,
      selectedExtras,
      extrasTotal,
      discountApplied: {
        ...discountApplied,
        amount: discountAmount,
      },
      subtotal,
      taxes,
      totalAmount,
      paymentMethod,
      specialRequests,
      isRefundable: room.isRefundable,
      refundPolicy: room.refundPolicy,
      cancellationPolicy: room.cancellationPolicy,
      breakfastIncluded: room.breakfastIncluded,
      checkInTime: room.checkInTime,
      checkOutTime: room.checkOutTime,
      source,
      createdBy: req.user ? req.user.id : null,
    };

    // Create new booking
    const newBooking = await RoomBooking.create(bookingData);

    // Update room availability using the availability service
    await updateRoomAvailability(roomId);

    // Populate the created booking
    const populatedBooking = await RoomBooking.findById(
      newBooking._id
    ).populate('roomId', 'name type category price images amenities');

    res.status(201).json({
      success: true,
      message: 'Room booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    console.error('Error creating room booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room booking',
      error: error.message,
    });
  }
};

// Update a room booking
export const updateRoomBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    // Store original room quantity for availability calculation
    const originalRoomQuantity = booking.roomQuantity;
    const originalRoomId = booking.roomId;

    // Validate if status change is allowed
    const allowedStatusChanges = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['checked_in', 'cancelled', 'no_show'],
      checked_in: ['checked_out'],
      checked_out: [],
      cancelled: [],
      no_show: [],
    };

    if (
      req.body.status &&
      !allowedStatusChanges[booking.status].includes(req.body.status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${req.body.status}`,
      });
    }

    // If dates are being updated, validate and check availability
    if (req.body.checkInDate || req.body.checkOutDate) {
      const newCheckIn = req.body.checkInDate
        ? new Date(req.body.checkInDate)
        : booking.checkInDate;
      const newCheckOut = req.body.checkOutDate
        ? new Date(req.body.checkOutDate)
        : booking.checkOutDate;

      if (newCheckOut <= newCheckIn) {
        return res.status(400).json({
          success: false,
          message: 'Check-out date must be after check-in date',
        });
      }

      // Check for overlapping bookings (excluding current booking)
      const overlappingBookings = await RoomBooking.find({
        _id: { $ne: booking._id },
        roomId: booking.roomId,
        status: { $nin: ['cancelled', 'no_show'] },
        $or: [
          {
            checkInDate: { $lte: newCheckIn },
            checkOutDate: { $gt: newCheckIn },
          },
          {
            checkInDate: { $lt: newCheckOut },
            checkOutDate: { $gte: newCheckOut },
          },
          {
            checkInDate: { $gte: newCheckIn },
            checkOutDate: { $lte: newCheckOut },
          },
        ],
      });

      const room = await Room.findById(booking.roomId);
      const totalRoomsBooked = overlappingBookings.reduce(
        (sum, booking) => sum + booking.roomQuantity,
        0
      );
      const newRoomQuantity = req.body.roomQuantity || booking.roomQuantity;

      if (
        totalRoomsBooked + newRoomQuantity >
        room.availableRooms + originalRoomQuantity
      ) {
        return res.status(400).json({
          success: false,
          message: 'Not enough rooms available for the updated dates',
        });
      }
    }

    // Update booking
    const updatedData = {
      ...req.body,
      updatedBy: req.user ? req.user.id : null,
    };

    const updatedBooking = await RoomBooking.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('roomId', 'name type category price images amenities');

    // Update room availability if room quantity changed
    if (
      req.body.roomQuantity &&
      req.body.roomQuantity !== originalRoomQuantity
    ) {
      await updateRoomAvailability(originalRoomId);
    }

    // If booking is cancelled, update room availability
    if (req.body.status === 'cancelled' && booking.status !== 'cancelled') {
      await updateRoomAvailability(originalRoomId);
    }

    res.status(200).json({
      success: true,
      message: 'Room booking updated successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating room booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update room booking',
      error: error.message,
    });
  }
};

// Cancel a room booking
export const cancelRoomBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (['checked_in', 'checked_out'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot cancel a booking that has already started or completed',
      });
    }

    // Update booking status to cancelled
    const updatedBooking = await RoomBooking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        updatedBy: req.user ? req.user.id : null,
      },
      { new: true }
    ).populate('roomId', 'name type category price images');

    // Update room availability using availability service
    await updateRoomAvailability(booking.roomId);

    res.status(200).json({
      success: true,
      message: 'Room booking cancelled successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error cancelling room booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel room booking',
      error: error.message,
    });
  }
};

// Delete a room booking (admin only)
export const deleteRoomBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Room booking not found',
      });
    }

    // Restore room availability if booking was not cancelled
    if (booking.status !== 'cancelled') {
      await updateRoomAvailability(booking.roomId);
    }

    await RoomBooking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room booking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting room booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete room booking',
      error: error.message,
    });
  }
};

// Check room availability
export const checkRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, roomQuantity = 1 } = req.query;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Room ID, check-in date, and check-out date are required',
      });
    }

    // Use the availability service to check availability
    const availabilityInfo = await checkRoomAvailabilityForBooking(
      roomId,
      new Date(checkInDate),
      new Date(checkOutDate),
      parseInt(roomQuantity)
    );

    res.status(200).json({
      success: true,
      data: availabilityInfo,
    });
  } catch (error) {
    console.error('Error checking room availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check room availability',
      error: error.message,
    });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const totalBookings = await RoomBooking.countDocuments(dateFilter);

    const statusStats = await RoomBooking.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const revenueStats = await RoomBooking.aggregate([
      { $match: { ...dateFilter, status: { $nin: ['cancelled'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageBookingValue: { $avg: '$totalAmount' },
        },
      },
    ]);

    const roomTypeStats = await RoomBooking.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$roomType', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        statusBreakdown: statusStats,
        revenue: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0 },
        roomTypeBreakdown: roomTypeStats,
      },
    });
  } catch (error) {
    console.error('Error getting booking statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking statistics',
      error: error.message,
    });
  }
};
