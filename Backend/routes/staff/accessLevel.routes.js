import express from "express";
import {
    getAllAccessLevels,
    getAccessLevelById,
    createAccessLevel,
    updateAccessLevel,
    deleteAccessLevel,
} from "../../controllers/staff/accessLevel.controller.js";

const router = express.Router();

// Route for all access levels
router.route("/").get(getAllAccessLevels).post(createAccessLevel);

// Routes for specific access level by ID
router
    .route("/:id")
    .get(getAccessLevelById)
    .put(updateAccessLevel)
    .delete(deleteAccessLevel);

export default router; 