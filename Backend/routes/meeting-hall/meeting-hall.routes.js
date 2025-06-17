import express from 'express';
import * as hallController from '../../controllers/meeting-hall/meeting-hall.controller.js';
import * as bookingController from '../../controllers/meeting-hall/hall-booking.controller.js';
import * as requestController from '../../controllers/meeting-hall/booking-request.controller.js';

const router = express.Router();

// Meeting Hall routes
router.route('/halls')
    .get(hallController.getAllMeetingHalls)
    .post(hallController.createMeetingHall);

router.route('/halls/:id')
    .get(hallController.getMeetingHall)
    .patch(hallController.updateMeetingHall)
    .delete(hallController.deleteMeetingHall);

// Booking routes
router.route('/bookings')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

router.route('/bookings/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

// Booking Request routes
router.route('/booking-requests')
    .get(requestController.getAllBookingRequests)
    .post(requestController.createBookingRequest);

router.route('/booking-requests/:id')
    .get(requestController.getBookingRequest)
    .patch(requestController.updateBookingRequest)
    .delete(requestController.deleteBookingRequest);

router.route('/booking-requests/:id/mark-as-read')
    .patch(requestController.markAsRead);

router.route('/booking-requests-count')
    .get(requestController.getNewRequestsCount);

export default router; 