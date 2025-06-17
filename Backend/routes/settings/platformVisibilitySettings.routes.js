import express from 'express';
import { getAllPlatformVisibilities, togglePlatformVisibility, updatePlatformVisibilities } from '../../controllers/settings/platformVisibilitySetting.Controller.js';

const router = express.Router();

// Get all platform visibility settings
router.get('/', getAllPlatformVisibilities);

// Update multiple platform visibility settings 
router.put('/', updatePlatformVisibilities);

// Toggle single platform visibility
router.patch('/toggle/:platformKey', togglePlatformVisibility);

export default router;
