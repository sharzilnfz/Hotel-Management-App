import express from 'express';
import {
  cancelRoomBooking,
  checkRoomAvailability,
  createRoomBooking,
  deleteRoomBooking,
  getAllRoomBookings,
  getBookingStats,
  getRoomBookingByBookingId,
  getRoomBookingById,
  updateRoomBooking,
} from '../../controllers/rooms/room-booking.controller.js';
import { optionalAuth, verifyToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Room booking routes

// Public routes (no authentication required)
router.post('/', optionalAuth, createRoomBooking); // Create booking (public for user bookings)
router.get('/availability', checkRoomAvailability); // Check room availability
router.get('/booking/:bookingId', getRoomBookingByBookingId); // Get booking by booking ID

// Protected routes (authentication required)
router.get('/', verifyToken, getAllRoomBookings); // Get all bookings (admin)
router.get('/stats', verifyToken, getBookingStats); // Get booking statistics (admin)
router.get('/:id', verifyToken, getRoomBookingById); // Get booking by ID
router.put('/:id', verifyToken, updateRoomBooking); // Update booking
router.patch('/:id/cancel', verifyToken, cancelRoomBooking); // Cancel booking
router.delete('/:id', verifyToken, deleteRoomBooking); // Delete booking (admin only)

export default router;
