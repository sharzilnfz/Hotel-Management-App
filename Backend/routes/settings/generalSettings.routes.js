import express from 'express';
import { getGeneralSettings, updateGeneralSettings } from '../../controllers/settings/generalSettings.controller.js';

const router = express.Router();

// Get general settings
router.get('/', getGeneralSettings);

// Update general settings
router.put('/', updateGeneralSettings);

export default router;
