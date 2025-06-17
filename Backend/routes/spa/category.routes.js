import express from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    seedCategories,
    updateServiceCount
} from "../../controllers/spa/category.controller.js";

const router = express.Router();

// Category routes
router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

// Additional routes
router.post("/seed", seedCategories);
router.patch("/:id/service-count", updateServiceCount);

export default router; 