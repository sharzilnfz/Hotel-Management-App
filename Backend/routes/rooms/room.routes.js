import express from 'express';
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
} from '../../controllers/rooms/room.controller.js';
import { verifyToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Room routes
router.post('/', verifyToken, createRoom);
router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.put('/:id', verifyToken, updateRoom);
router.delete('/:id', verifyToken, deleteRoom);

export default router;
