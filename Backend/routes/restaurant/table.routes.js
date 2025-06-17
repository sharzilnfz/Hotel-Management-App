import express from "express";
import {
    createTable,
    getAllTables,
    getTableById,
    updateTableStatus,
    updateTable,
    deleteTable
} from "../../controllers/restaurant/table.controller.js";

const router = express.Router();

// Restaurant table routes
router.post("/", createTable);
router.get("/", getAllTables);
router.get("/:id", getTableById);
router.put("/status/:id", updateTableStatus);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router; 