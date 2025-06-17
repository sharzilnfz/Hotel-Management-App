import express from "express";
import {
    createSpecialist,
    getAllSpecialists,
    getSpecialistById,
    updateSpecialist,
    deleteSpecialist
} from "../../controllers/spa/specialist.controller.js";

const router = express.Router();

// Specialist routes
router.post("/", createSpecialist);
router.get("/", getAllSpecialists);
router.get("/:id", getSpecialistById);
router.put("/:id", updateSpecialist);
router.delete("/:id", deleteSpecialist);

export default router; 