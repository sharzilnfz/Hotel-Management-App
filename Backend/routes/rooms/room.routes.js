import express from "express";
import {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom
} from "../../controllers/rooms/room.controller.js";

const router = express.Router();

// Room routes
router.post("/", createRoom);
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router; 