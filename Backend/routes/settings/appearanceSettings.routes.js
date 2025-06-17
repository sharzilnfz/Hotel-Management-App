import express from 'express';
import * as appearanceSettingsController from '../../controllers/settings/appearanceSettings.controller.js';

const router = express.Router();

// Get appearance settings
router.get('/', appearanceSettingsController.getAppearanceSettings);

// Update colors
router.put('/colors', appearanceSettingsController.updateColors);

// Add a new color
router.post('/colors', appearanceSettingsController.addColor);

// Delete a color
router.delete('/colors/:id', appearanceSettingsController.deleteColor);

// Import colors
router.post('/colors/import', appearanceSettingsController.importColors);

// Update fonts
router.put('/fonts', appearanceSettingsController.updateFonts);

// Add a new font
router.post('/fonts', appearanceSettingsController.addFont);

// Delete a font
router.delete('/fonts/:id', appearanceSettingsController.deleteFont);

// Upload a font file
router.post('/fonts/upload', appearanceSettingsController.uploadFont);

export default router;
