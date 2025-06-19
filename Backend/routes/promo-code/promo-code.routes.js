import express from 'express';
import * as promoCodeController from '../../controllers/promo-code/promo-code.controller.js';
import { verifyToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes for validating and applying promo codes (used during booking)
router.post('/promo-codes/validate', promoCodeController.validatePromoCode);
router.post('/promo-codes/apply', promoCodeController.applyPromoCode);

// Protected admin routes
router
  .route('/promo-codes')
  .get(verifyToken, promoCodeController.getAllPromoCodes)
  .post(verifyToken, promoCodeController.createPromoCode);

router
  .route('/promo-codes/:id')
  .get(verifyToken, promoCodeController.getPromoCode)
  .patch(verifyToken, promoCodeController.updatePromoCode)
  .delete(verifyToken, promoCodeController.deletePromoCode);

export default router;
