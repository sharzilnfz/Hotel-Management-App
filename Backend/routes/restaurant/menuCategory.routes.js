import express from "express";
import {
    createMenuCategory,
    getAllMenuCategories,
    getMenuCategoryById,
    updateMenuCategory,
    deleteMenuCategory
} from "../../controllers/restaurant/menuCategory.controller.js";

const router = express.Router();

// Menu Category routes
router.post("/", createMenuCategory);
router.get("/", getAllMenuCategories);
router.get("/:id", getMenuCategoryById);
router.put("/:id", updateMenuCategory);
router.delete("/:id", deleteMenuCategory);

export default router; 