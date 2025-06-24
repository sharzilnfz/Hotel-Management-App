import express from 'express';
import {
  getRestaurantSettings,
  updateRestaurantSettings,
} from '../../controllers/restaurant/restaurantSettings.controller.js';

const router = express.Router();

// GET /api/restaurant/settings - Get restaurant settings
router.get('/', getRestaurantSettings);

// POST /api/restaurant/settings - Update restaurant settings
router.post('/', updateRestaurantSettings);

export default router;
