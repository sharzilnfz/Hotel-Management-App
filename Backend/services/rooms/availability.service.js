import Availability from '../../models/availability/availability.model.js';
import RoomBooking from '../../models/rooms/room-booking.model.js';
import Room from '../../models/rooms/room.model.js';

/**
 * Room Availability Service
 * Handles synchronization between room bookings and availability tracking
 */

/**
 * Update room availability based on bookings
 * @param {string} roomId - Room ID
 * @param {Date} date - Specific date to update (optional)
 */
export const updateRoomAvailability = async (roomId, date = null) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // If specific date is provided, update for that date only
    if (date) {
      await updateAvailabilityForDate(room, new Date(date));
    } else {
      // Update current availability count on the room document
      await updateCurrentRoomAvailability(room);
    }
  } catch (error) {
    console.error('Error updating room availability:', error);
    throw error;
  }
};

/**
 * Update current room availability count
 * @param {Object} room - Room document
 */
const updateCurrentRoomAvailability = async (room) => {
  try {
    // Get all active bookings for this room
    const activeBookings = await RoomBooking.find({
      roomId: room._id,
      status: { $nin: ['cancelled', 'checked_out', 'no_show'] },
      checkInDate: { $lte: new Date() },
      checkOutDate: { $gt: new Date() },
    });

    // Calculate total rooms currently booked
    const totalBooked = activeBookings.reduce(
      (sum, booking) => sum + booking.roomQuantity,
      0
    );

    // Update room's available count
    const availableRooms = Math.max(0, room.totalRooms - totalBooked);

    await Room.findByIdAndUpdate(room._id, {
      availableRooms: availableRooms,
    });

    console.log(
      `Updated room ${room.name} availability: ${availableRooms}/${room.totalRooms}`
    );
  } catch (error) {
    console.error('Error updating current room availability:', error);
    throw error;
  }
};

/**
 * Update availability for a specific date
 * @param {Object} room - Room document
 * @param {Date} date - Date to update
 */
const updateAvailabilityForDate = async (room, date) => {
  try {
    // Get bookings for this specific date
    const bookingsForDate = await RoomBooking.find({
      roomId: room._id,
      status: { $nin: ['cancelled', 'no_show'] },
      checkInDate: { $lte: date },
      checkOutDate: { $gt: date },
    });

    // Calculate rooms booked for this date
    const totalBooked = bookingsForDate.reduce(
      (sum, booking) => sum + booking.roomQuantity,
      0
    );
    const availableForDate = Math.max(0, room.totalRooms - totalBooked);

    // Update or create availability record
    await Availability.findOneAndUpdate(
      {
        serviceType: 'room',
        serviceId: room._id,
        date: date,
      },
      {
        serviceName: room.name,
        total: room.totalRooms,
        available: availableForDate,
        bookings: totalBooked,
        updatedBy: 'booking-system',
      },
      { upsert: true, new: true }
    );

    console.log(
      `Updated availability for ${
        room.name
      } on ${date.toDateString()}: ${availableForDate}/${room.totalRooms}`
    );
  } catch (error) {
    console.error('Error updating availability for date:', error);
    throw error;
  }
};

/**
 * Check if room is available for booking
 * @param {string} roomId - Room ID
 * @param {Date} checkInDate - Check-in date
 * @param {Date} checkOutDate - Check-out date
 * @param {number} roomQuantity - Number of rooms requested
 * @returns {Object} Availability information
 */
export const checkRoomAvailabilityForBooking = async (
  roomId,
  checkInDate,
  checkOutDate,
  roomQuantity = 1
) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Get overlapping bookings
    const overlappingBookings = await RoomBooking.find({
      roomId,
      status: { $nin: ['cancelled', 'no_show'] },
      $or: [
        {
          checkInDate: { $lte: checkInDate },
          checkOutDate: { $gt: checkInDate },
        },
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gte: checkOutDate },
        },
        {
          checkInDate: { $gte: checkInDate },
          checkOutDate: { $lte: checkOutDate },
        },
      ],
    });

    // Calculate maximum rooms booked during the period
    const roomsBookedByDate = {};

    // Iterate through each day in the booking period
    const currentDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    while (currentDate < endDate) {
      const dateKey = currentDate.toDateString();
      roomsBookedByDate[dateKey] = 0;

      // Count bookings for this date
      overlappingBookings.forEach((booking) => {
        if (
          booking.checkInDate <= currentDate &&
          booking.checkOutDate > currentDate
        ) {
          roomsBookedByDate[dateKey] += booking.roomQuantity;
        }
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Find the maximum rooms booked on any single day
    const maxRoomsBooked = Math.max(0, ...Object.values(roomsBookedByDate));
    const availableRooms = room.totalRooms - maxRoomsBooked;
    const isAvailable = availableRooms >= roomQuantity;

    return {
      roomId: room._id,
      roomName: room.name,
      totalRooms: room.totalRooms,
      availableRooms: Math.max(0, availableRooms),
      requestedQuantity: roomQuantity,
      isAvailable,
      checkInDate,
      checkOutDate,
      bookingDetails: roomsBookedByDate,
    };
  } catch (error) {
    console.error('Error checking room availability for booking:', error);
    throw error;
  }
};

/**
 * Bulk update availability for multiple rooms
 * @param {Array} roomIds - Array of room IDs
 * @param {Date} startDate - Start date for update (optional)
 * @param {Date} endDate - End date for update (optional)
 */
export const bulkUpdateRoomAvailability = async (
  roomIds,
  startDate = null,
  endDate = null
) => {
  try {
    console.log(`Bulk updating availability for ${roomIds.length} rooms...`);

    const promises = roomIds.map(async (roomId) => {
      if (startDate && endDate) {
        // Update for date range
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          await updateRoomAvailability(roomId, new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        // Update current availability
        await updateRoomAvailability(roomId);
      }
    });

    await Promise.all(promises);
    console.log('Bulk availability update completed');
  } catch (error) {
    console.error('Error in bulk availability update:', error);
    throw error;
  }
};

/**
 * Get room availability statistics
 * @param {string} roomId - Room ID (optional)
 * @param {Date} startDate - Start date (optional)
 * @param {Date} endDate - End date (optional)
 * @returns {Object} Availability statistics
 */
export const getRoomAvailabilityStats = async (
  roomId = null,
  startDate = null,
  endDate = null
) => {
  try {
    let query = {};

    if (roomId) query.roomId = roomId;
    if (startDate || endDate) {
      query.checkInDate = {};
      if (startDate) query.checkInDate.$gte = startDate;
      if (endDate) query.checkInDate.$lte = endDate;
    }

    const bookings = await RoomBooking.find(query);
    const rooms = roomId ? [await Room.findById(roomId)] : await Room.find({});

    const stats = {
      totalRooms: rooms.reduce((sum, room) => sum + room.totalRooms, 0),
      totalBookings: bookings.length,
      occupancyByStatus: {},
      revenueByStatus: {},
      averageOccupancy: 0,
    };

    // Calculate stats by booking status
    bookings.forEach((booking) => {
      if (!stats.occupancyByStatus[booking.status]) {
        stats.occupancyByStatus[booking.status] = 0;
        stats.revenueByStatus[booking.status] = 0;
      }
      stats.occupancyByStatus[booking.status] += booking.roomQuantity;
      stats.revenueByStatus[booking.status] += booking.totalAmount;
    });

    // Calculate average occupancy
    const activeBookings = bookings.filter(
      (b) => !['cancelled', 'no_show'].includes(b.status)
    );
    const totalRoomNights = activeBookings.reduce((sum, booking) => {
      const nights = Math.ceil(
        (booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24)
      );
      return sum + booking.roomQuantity * nights;
    }, 0);

    if (startDate && endDate && stats.totalRooms > 0) {
      const totalDays = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );
      const totalAvailableRoomNights = stats.totalRooms * totalDays;
      stats.averageOccupancy =
        (totalRoomNights / totalAvailableRoomNights) * 100;
    }

    return stats;
  } catch (error) {
    console.error('Error getting room availability stats:', error);
    throw error;
  }
};
