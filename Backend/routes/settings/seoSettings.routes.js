import express from 'express';
import { getSeoSettings, updateSeoSettings } from '../../controllers/settings/seoSettings.controller.js';

const router = express.Router();

// Get SEO settings
router.get('/', getSeoSettings);

// Update SEO settings
router.put('/', updateSeoSettings);

export default router;
