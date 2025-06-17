import express from "express";
import {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../../controllers/staff/department.controller.js";

const router = express.Router();

// Route for all departments
router.route("/").get(getAllDepartments).post(createDepartment);

// Routes for specific department by ID
router
    .route("/:id")
    .get(getDepartmentById)
    .put(updateDepartment)
    .delete(deleteDepartment);

export default router; 