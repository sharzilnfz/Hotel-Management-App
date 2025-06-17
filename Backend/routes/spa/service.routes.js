import express from 'express';
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    seedServices
} from '../../controllers/spa/service.controller.js';

const router = express.Router();

// GET all services
router.get('/', getAllServices);

// GET single service by ID
router.get('/:id', getServiceById);

// POST create a new service
router.post('/', createService);

// PUT update a service
router.put('/:id', updateService);

// DELETE a service
router.delete('/:id', deleteService);

// POST seed initial services
router.post('/seed', seedServices);

export default router; 