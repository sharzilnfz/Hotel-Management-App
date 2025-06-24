import express from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  triggerStatusUpdate,
  updateEvent,
  updateEventStatus,
} from '../../controllers/events/event.controller.js';

const router = express.Router();

// Event routes
router.post('/', createEvent);
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.post('/update-statuses', triggerStatusUpdate); // Manual trigger for status updates
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.put('/status/:id', updateEventStatus);
router.delete('/:id', deleteEvent);

export default router;
