import express from 'express';
import { getAllCurrencies, toggleCurrency, updateCurrencies } from '../../controllers/settings/currenciesSettings.controller.js';

const router = express.Router();

// Get all currencies
router.get('/', getAllCurrencies);

// Update multiple currencies 
router.put('/', updateCurrencies);

// Toggle single currency
router.patch('/toggle/:currencyCode', toggleCurrency);

export default router;
