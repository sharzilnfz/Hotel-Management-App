import express from "express";
import {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem
} from "../../controllers/restaurant/menuItem.controller.js";

const router = express.Router();

// Menu Item routes
router.post("/", createMenuItem);
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router; 