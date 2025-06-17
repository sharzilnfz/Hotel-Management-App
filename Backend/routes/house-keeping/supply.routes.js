import express from 'express';
import {
    getAllSupplies,
    getSupply,
    createSupply,
    updateSupply,
    deleteSupply,
    orderSupply,
    updateStock
} from '../../controllers/house-keeping/supply.controller.js';

const router = express.Router();

// Get all supplies and create a new supply
router.route('/')
    .get(getAllSupplies)
    .post(createSupply);

// Get, update, and delete a specific supply
router.route('/:id')
    .get(getSupply)
    .put(updateSupply)
    .delete(deleteSupply);

// Order a supply
router.route('/:id/order')
    .post(orderSupply);

// Update supply stock
router.route('/:id/stock')
    .patch(updateStock);

export default router; 