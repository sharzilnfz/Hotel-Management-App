import express from 'express';
import * as promoCodeController from '../../controllers/promo-code/promo-code.controller.js';

const router = express.Router();

// Promo code routes
router.route('/promo-codes')
    .get(promoCodeController.getAllPromoCodes)
    .post(promoCodeController.createPromoCode);

router.route('/promo-codes/:id')
    .get(promoCodeController.getPromoCode)
    .patch(promoCodeController.updatePromoCode)
    .delete(promoCodeController.deletePromoCode);

export default router; 